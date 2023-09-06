import { EnvironmentWithUserCommand } from '@novu/application-generic';
import { IsArray, IsString, IsDefined } from 'class-validator';

export class GetWebhookStatusCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  transactionId: string[];
}
