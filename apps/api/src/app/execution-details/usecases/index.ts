import { BulkCreateExecutionDetails, CreateExecutionDetails } from '@novu/application-generic';

import { GetExecutionDetails } from './get-execution-details';
import { GetWebhookStatus } from './get-webhook-status';

export const USE_CASES = [CreateExecutionDetails, BulkCreateExecutionDetails, GetExecutionDetails, GetWebhookStatus];
