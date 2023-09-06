import { IsDefined, IsArray, IsString } from 'class-validator';

export class GetWebhookStatusRequestDto {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  transactionId: string[];
}
