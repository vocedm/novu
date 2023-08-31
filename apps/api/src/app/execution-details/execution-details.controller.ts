import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IJwtPayload } from '@novu/shared';
import { ExecutionDetailsResponseDto } from '@novu/application-generic';
import { UserSession } from '../shared/framework/user.decorator';
import { UserAuthGuard } from '../auth/framework/user.auth.guard';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { GetExecutionDetails, GetExecutionDetailsCommand } from './usecases/get-execution-details';
import { ApiCommonResponses, ApiResponse } from '../shared/framework/response.decorator';
import { GetWebhookStatus, GetWebhookStatusCommand } from './usecases/get-webhook-status';
import { ExecutionDetailsRequestDto } from './dtos/execution-details-request.dto';
import { GetWebhookStatusRequestDto } from './dtos/get-webhook-status-request.dto';

@ApiCommonResponses()
@Controller('/execution-details')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(UserAuthGuard)
@ApiTags('Execution Details')
export class ExecutionDetailsController {
  constructor(private getExecutionDetails: GetExecutionDetails, private getWebhookStatus: GetWebhookStatus) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get execution details',
  })
  @ApiResponse(ExecutionDetailsResponseDto, 200, true)
  @ExternalApiAccessible()
  async getExecutionDetailsForNotification(
    @UserSession() user: IJwtPayload,
    @Query() query: ExecutionDetailsRequestDto
  ): Promise<ExecutionDetailsResponseDto[]> {
    return this.getExecutionDetails.execute(
      GetExecutionDetailsCommand.create({
        organizationId: user.organizationId,
        environmentId: user.environmentId,
        userId: user._id,
        notificationId: query.notificationId,
        subscriberId: query.subscriberId,
      })
    );
  }

  @Get('/webhook')
  @ApiOperation({
    summary: 'Get webhook status details',
  })
  @ApiResponse(ExecutionDetailsResponseDto, 200, true)
  @ExternalApiAccessible()
  async getExecutionDetailsForTransaction(
    @UserSession() user: IJwtPayload,
    @Query() query: GetWebhookStatusRequestDto
  ): Promise<ExecutionDetailsResponseDto[]> {
    return this.getWebhookStatus.execute(
      GetWebhookStatusCommand.create({
        transactionId: query.transactionId,
        userId: user._id,
        environmentId: user.environmentId,
        organizationId: user.organizationId,
      })
    );
  }
}
