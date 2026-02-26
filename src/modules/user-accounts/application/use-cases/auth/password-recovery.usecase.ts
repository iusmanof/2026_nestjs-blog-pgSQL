import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryDto } from '../../../api/dto/password-recovery.dto';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import UsersRepository from '../../../infrastructure/users.repository';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { EmailService } from '../../../../notification/email.service';
import { CodeGeneratorService } from '../../code-generator.service';
import { EmailConfirmationRepository } from '../../../infrastructure/email-confirmation.repository';

export class PasswordRecoveryCommand {
  constructor(public dto: PasswordRecoveryDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const user = await this.usersQueryRepository.findByEmail(command.dto.email);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
        extensions: [{ field: 'recoveryCode', message: 'User not found' }],
      });
    }

    const recoveryCode = this.codeGeneratorService.generateNumericCode(6);
    // TODO expireAt in service
    const recoveryCodeExpiration = new Date(Date.now() + 1000 * 60 * 15);

    const userEmailConfirmation = await this.emailConfirmationRepository.findByUserId(user.id);

    if (!userEmailConfirmation) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Confirmation not found',
        extensions: [{ field: 'recoveryCode', message: 'Confirmation not found' }],
      });
    }

    await this.emailConfirmationRepository.updateCode({
      userId: userEmailConfirmation.id.toString(),
      code: recoveryCode,
      expiresAt: recoveryCodeExpiration,
    });

    // TODO use DDD
    this.emailService.sendConfirmationEmail(user.email, recoveryCode).catch(console.error);
  }
}
