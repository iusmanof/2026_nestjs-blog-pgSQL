import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import UsersRepository from '../../../infrastructure/users.repository';
import { EmailService } from '../../../../notification/email.service';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { EmailConfirmationRepository } from '../../../infrastructure/email-confirmation.repository';

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
    const user = await this.usersQueryRepository.findByEmail(command.email);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
        extensions: [{ field: 'email', message: 'User not found' }],
      });
    }

    const userEmailConfirmation = await this.emailConfirmationRepository.findByUserId(user.id);

    if (!userEmailConfirmation || userEmailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already confirmed',
        extensions: [{ field: 'email', message: 'Email already confirmed' }],
      });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newCodeExpiration = new Date(Date.now() + 1000 * 60 * 15);
    const params = { userId: user.id, code: newCode, expiresAt: newCodeExpiration };
    await this.emailConfirmationRepository.updateCode(params);
    // TODO DDD
    // user.setConfirmationCode(newCode);
    // await this.usersRepository.save(user);

    await this.emailService.sendConfirmationEmail(user.email, newCode);
    return;
  }
}
