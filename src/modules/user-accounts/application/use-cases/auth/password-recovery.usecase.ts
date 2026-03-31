import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryDto } from '../../../api/dto/password-recovery.dto';
import { EmailService } from '@modules/notification/email.service';
import { CodeGeneratorService } from '../../code-generator.service';
import EmailConfirmationRepository from '../../../infrastructure/email-confirmation.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import UsersRepository from '@user-accounts/infrastructure/users.repository';

export class PasswordRecoveryCommand {
  constructor(public dto: PasswordRecoveryDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const user = await this.usersRepository.findByEmail(command.dto.email);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
        extensions: [{ field: 'recoveryCode', message: 'User not found' }],
      });
    }

    const userEmailConfirmationEntity = await this.emailConfirmationRepository.findByUserId(
      user.userId,
    );
    if (!userEmailConfirmationEntity) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation not found',
        extensions: [{ field: 'recoveryCode', message: 'Confirmation not found' }],
      });
    }

    const recoveryCode = this.codeGeneratorService.generateNumericCode(6);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    userEmailConfirmationEntity.updateRecoveryCode(recoveryCode, expiresAt);
    await this.emailConfirmationRepository.save(userEmailConfirmationEntity);

    this.emailService.sendConfirmationEmail(user.email, recoveryCode).catch(console.error);
  }
}
