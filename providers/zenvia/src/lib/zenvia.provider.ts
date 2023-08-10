import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from '@novu/stateless';
import axios from 'axios';
import { ZenviaParams } from '../types/param';

export class ZenviaProvider implements ISmsProvider {
  id = 'zenvia';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  private axiosInstance = axios.create();

  constructor(
    private config: {
      apiKey: string;
      domain: string;
    }
  ) {}

  async sendMessage(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    switch (this.config.domain) {
      case 'SMS':
        this.sendSMS(options);
        break;
      case 'WHATSAPP':
        this.sendWhatsapp(options);
        break;
      default:
        return;
    }
  }

  private async sendWhatsapp(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    const BASE_URL = 'https://api.zenvia.com/v2/channels/whatsapp/messages';

    /*
     * const contents: Content = [
     *   {
     *     type: options.contents.IContentOptions.type,
     *     templateId: options.contents.IContentOptions.templateId,
     *     fields: options.contents.IContentOptions.fields,
     *   },
     * ];
     */

    //Create post body
    const data: ZenviaParams = {
      from: options.from,
      to: options.to,
      contents: options.contents,
    };

    //set token in "X-API-TOKEN: YOUR_API_TOKEN" \

    //make request
    const header = {
      headers: {
        'X-Auth-Token': this.config.apiKey,
        'content-type': 'application/json',
      },
    };

    const url = `${BASE_URL}`;
    const response = await this.axiosInstance.post(url, data, header);

    //set return
    return {
      id: response.data.id,
      date: new Date().toISOString(),
    };
  }

  private async sendSMS(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    const BASE_URL = 'https://api.zenvia.com/v2/channels/sms/messages';

    /*
     * const contents: Content = [
     *   {
     *     type: options.contents.IContentOptions.type,
     *     templateId: options.contents.IContentOptions.templateId,
     *     fields: options.contents.IContentOptions.fields,
     *   },
     * ];
     */

    //Create post body
    const data: ZenviaParams = {
      from: options.from,
      to: options.to,
      contents: options.contents,
    };

    const header = {
      headers: {
        'X-Auth-Token': this.config.apiKey,
        'content-type': 'application/json',
      },
    };

    const url = `${BASE_URL}`;
    const response = await this.axiosInstance.post(url, data, header);

    //set return
    return {
      id: response.data.id,
      date: new Date().toISOString(),
    };
  }
}
