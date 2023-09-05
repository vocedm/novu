import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@novu/dal';
import { AnalyticsService, buildUserKey, InvalidateCacheService } from '@novu/application-generic';

import { UpdateProfileEmailCommand } from './update-profile-email.command';
import { normalizeEmail } from '../../../shared/helpers/email-normalization.service';

@Injectable()
export class UpdateProfileEmail {
  constructor(
    private invalidateCache: InvalidateCacheService,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AnalyticsService))
    private analyticsService: AnalyticsService
  ) {}

  async execute(command: UpdateProfileEmailCommand) {
    const email = normalizeEmail(command.email);
    const user = await this.userRepository.findByEmail(email);
    if (user) throw new BadRequestException('E-mail is invalid or taken');

    await this.userRepository.update(
      {
        _id: command.userId,
      },
      {
        $set: {
          email,
        },
      }
    );

    await this.invalidateCache.invalidateByKey({
      key: buildUserKey({
        _id: command.userId,
      }),
    });

    const updatedUser = await this.userRepository.findById(command.userId);
    if (!updatedUser) throw new NotFoundException('User not found');

    this.analyticsService.setValue(updatedUser._id, 'email', email);

    return updatedUser;
  }
}
