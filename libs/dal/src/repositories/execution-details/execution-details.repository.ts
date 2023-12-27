import { ExecutionDetailsStatusEnum } from '@novu/shared';

import { ExecutionDetailsEntity, ExecutionDetailsDBModel } from './execution-details.entity';
import { ExecutionDetails } from './execution-details.schema';
import { BaseRepository } from '../base-repository';
import { EnforceEnvId } from '../../types/enforce';

/**
 * Execution details is meant to be read only almost exclusively as a log history of the Jobs executions.
 */
export class ExecutionDetailsRepository extends BaseRepository<
  ExecutionDetailsDBModel,
  ExecutionDetailsEntity,
  EnforceEnvId
> {
  constructor() {
    super(ExecutionDetails, ExecutionDetailsEntity);
  }

  /**
   * As we have a status of potentially read confirmation for notifications that might have that kind
   * of confirmation there is potentially use of this method
   */
  public async updateStatus(environmentId: string, executionDetailsId: string, status: ExecutionDetailsStatusEnum) {
    await this.update(
      {
        _environmentId: environmentId,
        _id: executionDetailsId,
      },
      {
        $set: {
          status,
        },
      }
    );
  }

  /**
   * Activity feed might need to retrieve all the executions of a notification.
   */
  public async findAllNotificationExecutions(organizationId: string, environmentId: string, notificationId: string) {
    return await this.find({
      _environmentId: environmentId,
      _notificationId: notificationId,
    });
  }

  /**
   * Activity feed might need to retrieve all the executions of a notification.
   */
  public async findByTransactionId(transactionId: string[], environmentId: string) {
    const match = { transactionId: { $in: transactionId } };
    const sort = { transactionId: 1, createdAt: -1 };
    const lookup = {
      from: 'jobs',
      localField: 'transactionId',
      foreignField: 'transactionId',
      as: 'jobInfo',
    };
    const group = {
      _id: '$transactionId',
      webhookStatus: { $first: '$webhookStatus' },
      providerId: { $first: '$providerId' },
      createdAt: { $first: '$createdAt' },
      jobStatus: { $first: '$jobInfo.status' },
      raw: { $first: '$raw' },
    };
    const project = {
      _id: 0,
      transactionId: '$_id',
      webhookStatus: '$webhookStatus',
      providerId: '$providerId',
      createdAt: '$createdAt',
      jobStatus: '$jobStatus',
      raw: '$raw',
    };

    const query = [
      {
        $match: match,
      },
      {
        $sort: sort,
      },
      {
        $lookup: lookup,
      },
      {
        $unwind: '$jobInfo',
      },
      {
        $group: group,
      },
      {
        $project: project,
      },
    ];

    const data = await this.aggregate(query);

    data.forEach(function (elem) {
      const newRaw = JSON.parse(elem.raw);
      elem.raw = newRaw;
    });

    return data;
  }
}
