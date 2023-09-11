import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class GetWebhookStatusRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  transactionId: string[];
}
