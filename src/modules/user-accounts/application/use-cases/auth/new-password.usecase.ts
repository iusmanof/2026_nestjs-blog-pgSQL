import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../../../api/dto/new-password.dto';
import { CryptoService } from '../../crypto.service';
import UsersRepository from '../../../infrastructure/users.repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import EmailConfirmationRepository from '../../../infrastructure/email-confirmation.repository';

export class NewPasswordCommand {
  constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: NewPasswordCommand): Promise<void> {
    const userEmailConfirmationEntity = await this.emailConfirmationRepository.findByRecoveryCode(
      command.dto.recoveryCode,
    );
    if (!userEmailConfirmationEntity) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid recovery code',
      });
    }
    userEmailConfirmationEntity.confirmRecovery(command.dto.recoveryCode);

    const user = await this.usersRepository.findById(userEmailConfirmationEntity.userId);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    const newPasswordHash = await this.cryptoService.createPasswordHash(command.dto.newPassword);
    user.updatePassword(newPasswordHash);

    await this.usersRepository.save(user);
    await this.emailConfirmationRepository.save(userEmailConfirmationEntity);
  }
}
