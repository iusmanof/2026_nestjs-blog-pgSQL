import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import UsersRepository from '../../../infrastructure/users.repository';
import { EmailService } from '@modules/notification/email.service';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import EmailConfirmationRepository from '../../../infrastructure/email-confirmation.repository';

export class RegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingCommand> {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: RegistrationEmailResendingCommand): Promise<any> {
    const userEntity = await this.usersRepository.findByEmail(command.email);
    if (!userEntity) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
        extensions: [{ field: 'email', message: 'User not found' }],
      });
    }

    const userEmailConfirmationEntity = await this.emailConfirmationRepository.findByUserId(
      userEntity.userId,
    );

    if (!userEmailConfirmationEntity || userEmailConfirmationEntity.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
        extensions: [{ field: 'email', message: 'Email already confirmed' }],
      });
    }

    const newCode = userEmailConfirmationEntity.generateNewCode();
    await this.emailConfirmationRepository.save(userEmailConfirmationEntity);
    await this.emailService.sendConfirmationEmail(userEntity.email, newCode);
    return;
  }
}
