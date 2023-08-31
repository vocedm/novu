import { EnvironmentWithUserCommand } from '@novu/application-generic';
import { IsDefined } from 'class-validator';

export class GetWebhookStatusCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  transactionId: string;
}
