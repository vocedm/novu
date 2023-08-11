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
      from: string;
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

    console.log('In ZAP ZENVIA');

    //Create post body
    const data: ZenviaParams = {
      from: options.from,
      to: options.to,
      contents: JSON.stringify(options.content),
    };

    console.log('CONTENT ZAP: ', data);

    //set token in "X-API-TOKEN: YOUR_API_TOKEN" \

    //make request
    const header = {
      headers: {
        'X-API-TOKEN': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    };

    console.log('CONTENT HEADER: ', header);

    const url = `${BASE_URL}`;
    console.log('URL ZAP: ', url);
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

    console.log('IN SMS');

    console.log('OPTIONS SMS: ', options);
    //Create post body
    const data: ZenviaParams = {
      from: options.from,
      to: options.to,
      contents: options.content,
    };

    console.log('CONTENT SMS: ', data);
    const header = {
      headers: {
        'X-API-TOKEN': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    };

    console.log('CONTENT HEADER SMS: ', header);

    const url = `${BASE_URL}`;
    const response = await this.axiosInstance.post(url, data, header);

    //set return
    return {
      id: response.data.id,
      date: new Date().toISOString(),
    };
  }
}
