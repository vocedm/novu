import { Injectable, NotFoundException } from '@nestjs/common';
import { ExecutionDetailsEntity, ExecutionDetailsRepository } from '@novu/dal';
import { GetWebhookStatusCommand } from './get-webhook-status.command';

@Injectable()
export class GetWebhookStatus {
  constructor(private executionDetailsRepository: ExecutionDetailsRepository) {}

  async execute(command: GetWebhookStatusCommand): Promise<ExecutionDetailsEntity[]> {
    return this.executionDetailsRepository.findByTransactionId(command.transactionId, command.environmentId);
  }
}
