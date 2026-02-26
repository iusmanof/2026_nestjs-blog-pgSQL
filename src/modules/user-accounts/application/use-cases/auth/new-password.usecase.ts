import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from 'src/modules/user-accounts/infrastructure/users.query-repository';
import { NewPasswordDto } from '../../../api/dto/new-password.dto';
import { CryptoService } from '../../crypto.service';
import UsersRepository from '../../../infrastructure/users.repository';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { EmailConfirmationRepository } from '../../../infrastructure/email-confirmation.repository';

export class NewPasswordCommand {
  constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: NewPasswordCommand): Promise<void> {
    // const user = await this.usersQueryRepository.findByRecoveryCode(command.dto.recoveryCode);
    const userEmailConfirmation = await this.emailConfirmationRepository.findByRecoveryCode(
      command.dto.recoveryCode,
    );

    if (!userEmailConfirmation) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid recovery code',
      });
    }

    if (!userEmailConfirmation.code || userEmailConfirmation.expiresAt < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.PasswordRecoveryCodeExpired,
        message: 'Recovery code expired',
      });
    }
    const newPasswordHash = await this.cryptoService.createPasswordHash(command.dto.newPassword);
    const params = { id: userEmailConfirmation.id, passwordHash: newPasswordHash };
    await this.usersRepository.updatePasswordHash(params);

    // TODO use DDD
    // user.passwordHash = await this.cryptoService.createPasswordHash(command.dto.newPassword);

    // user.recoveryCode = undefined;
    // user.recoveryCodeExpiration = undefined;

    // await this.usersRepository.save(user);
  }
}
