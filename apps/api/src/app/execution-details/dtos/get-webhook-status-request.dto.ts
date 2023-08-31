import { IsDefined, IsMongoId, IsString } from 'class-validator';

export class GetWebhookStatusRequestDto {
  @IsDefined()
  @IsString()
  transactionId: string;
}
