import { ExecutionDetailsRepository, SubscriberEntity } from '@novu/dal';
import { ExecutionDetailsSourceEnum, ExecutionDetailsStatusEnum, StepTypeEnum } from '@novu/shared';
import { UserSession, SubscribersService } from '@novu/testing';
import axios from 'axios';
import { expect } from 'chai';

const axiosInstance = axios.create();

describe('Execution details - Get webhook details by transaction id - /v1/execution-details/webhook/:transactionId (GET)', function () {
  let session: UserSession;
  const executionDetailsRepository: ExecutionDetailsRepository = new ExecutionDetailsRepository();
  let subscriber: SubscriberEntity;
  let subscriberService: SubscribersService;

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();
    subscriberService = new SubscribersService(session.organization._id, session.environment._id);
    subscriber = await subscriberService.createSubscriber();
  });

  it('should get webhook executation details by transactionId', async function () {
    const transactionId = 'transactionId';
    const detail = await executionDetailsRepository.create({
      _jobId: ExecutionDetailsRepository.createObjectId(),
      _environmentId: session.environment._id,
      _organizationId: session.organization._id,
      _notificationId: ExecutionDetailsRepository.createObjectId(),
      _notificationTemplateId: ExecutionDetailsRepository.createObjectId(),
      _subscriberId: subscriber._id,
      providerId: '',
      transactionId: 'transactionId',
      channel: StepTypeEnum.EMAIL,
      detail: '',
      source: ExecutionDetailsSourceEnum.WEBHOOK,
      status: ExecutionDetailsStatusEnum.SUCCESS,
      isTest: false,
      isRetry: false,
    });

    const {
      data: { data },
    } = await axiosInstance.get(`${session.serverUrl}/v1/execution-details/webook?transactionId=${transactionId}`, {
      headers: {
        authorization: `ApiKey ${session.apiKey}`,
      },
    });
    const responseDetail = data[0];
    expect(responseDetail.transactionId).to.equal(transactionId);
    expect(responseDetail.channel).to.equal(detail.channel);
    expect(responseDetail._id).to.equal(detail._id);
  });
});
