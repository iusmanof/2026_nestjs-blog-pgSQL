import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import EmailConfirmationRepository from '../../../infrastructure/email-confirmation.repository';

export class RegistrationConfirmationCommand {
  constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}
  async execute(command: RegistrationConfirmationCommand): Promise<void> {
    const userEmailConfirmationEntity = await this.emailConfirmationRepository.findByRecoveryCode(
      command.code,
    );
    if (!userEmailConfirmationEntity) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
        extensions: [{ field: 'code', message: 'Invalid code' }],
      });
    }

    userEmailConfirmationEntity.confirmEmail(command.code);
    await this.emailConfirmationRepository.save(userEmailConfirmationEntity);
  }
}
