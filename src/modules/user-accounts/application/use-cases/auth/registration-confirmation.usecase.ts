import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import UsersRepository from '../../../infrastructure/users.repository';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { EmailConfirmationRepository } from '../../../infrastructure/email-confirmation.repository';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: RegistrationConfirmationCommand): Promise<void> {
    const userEmailConfirmation = await this.emailConfirmationRepository.findByRecoveryCode(
      command.code,
    );

    if (!userEmailConfirmation) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
        extensions: [{ field: 'code', message: 'Invalid code' }],
      });
    }

    if (userEmailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
        extensions: [{ field: 'code', message: 'Email already confirmed' }],
      });
    }

    if (userEmailConfirmation.expiresAt && userEmailConfirmation.expiresAt < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation code expired',
        extensions: [{ field: 'code', message: 'Code expired' }],
      });
    }

    // TODO use DDD
    await this.emailConfirmationRepository.completeConfirmation(userEmailConfirmation.id);
    // user.confirmEmail();
    // await this.usersRepository.save(user);
  }
}
