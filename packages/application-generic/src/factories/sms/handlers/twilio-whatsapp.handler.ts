import { TwilioWhatsAppProvider } from '@novu/twilio-whatsapp';
import { ChannelTypeEnum, ICredentials } from '@novu/shared';
import { BaseSmsHandler } from './base.handler';

export class TwilioWhatsAppHandler extends BaseSmsHandler {
  constructor() {
    super('twilio-whatsapp', ChannelTypeEnum.SMS);
  }
  buildProvider(credentials: ICredentials) {
    this.provider = new TwilioWhatsAppProvider({
      accountSid: credentials.accountSid,
      authToken: credentials.token,
      from: credentials.from,
    });
  }
}
