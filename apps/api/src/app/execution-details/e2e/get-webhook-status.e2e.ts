import { ExecutionDetailsRepository } from '@novu/dal';
import { UserSession } from '@novu/testing';
import { expect } from 'chai';
import { ExecutionDetailsSourceEnum, ExecutionDetailsStatusEnum, StepTypeEnum } from '@novu/shared';

describe('should get webhook details by transactionId - /executation-details/webhook (GET)', function () {
  let session: UserSession;
  const executionDetailsRepository: ExecutionDetailsRepository = new ExecutionDetailsRepository();

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();
  });

  it('get webhook executation details by transactionId', async function () {
    const transactionId = 'transactionId';
    const detail = await executionDetailsRepository.create({
      _jobId: ExecutionDetailsRepository.createObjectId(),
      _environmentId: session.environment._id,
      _organizationId: session.organization._id,
      _notificationId: ExecutionDetailsRepository.createObjectId(),
      _notificationTemplateId: ExecutionDetailsRepository.createObjectId(),
      _subscriberId: ExecutionDetailsRepository.createObjectId(),
      providerId: '',
      transactionId: 'transactionId',
      channel: StepTypeEnum.EMAIL,
      detail: '',
      source: ExecutionDetailsSourceEnum.WEBHOOK,
      status: ExecutionDetailsStatusEnum.SUCCESS,
      isTest: false,
      isRetry: false,
    });
    const payload = {
      transactionId: ['transactionId'],
    };

    const { body } = await session.testAgent.get(`/v1/executation-details/webhook`).send(payload);
    expect(body[0].transactionId).to.equal('transactionId');
  });
});
