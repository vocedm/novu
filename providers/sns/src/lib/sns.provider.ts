import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
  ISMSEventBody,
  SmsEventStatusEnum,
} from '@novu/stateless';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { SNSConfig } from './sns.config';

export class SNSSmsProvider implements ISmsProvider {
  id = 'sns';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  private client: SNSClient;

  constructor(private readonly config: SNSConfig) {
    this.client = new SNSClient({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });
  }

  async sendMessage(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    const { to, content } = options;

    const publish = new PublishCommand({
      PhoneNumber: to,
      Message: content,
    });

    const snsResponse = await this.client.send(publish);

    return {
      id: snsResponse.MessageId,
      date: new Date().toISOString(),
    };
  }

  getMessageId(body: any | any[]): string[] {
    console.log(body);
    if (Array.isArray(body)) {
      return body.map((item) => item.message.notification.messageId);
    }

    return [body.message.notification.messageId];
  }

  parseEventBody(
    body: any | any[],
    identifier: string
  ): ISMSEventBody | undefined {
    console.log(body);

    if (Array.isArray(body)) {
      body = body.find(
        (item) => item.message.notification.messageId === identifier
      );
    }

    if (!body) {
      return undefined;
    }

    const status = this.getStatus(body.message.status);

    if (status === undefined) {
      return undefined;
    }

    return {
      status: status,
      date: new Date().toISOString(),
      externalId: body.message.notification.messageId,
      row: body,
    };
  }

  private getStatus(event: string): SmsEventStatusEnum | undefined {
    switch (event) {
      case 'FAILURE':
        return SmsEventStatusEnum.FAILED;
      case 'SUCCESS':
        return SmsEventStatusEnum.DELIVERED;
    }
  }
}
