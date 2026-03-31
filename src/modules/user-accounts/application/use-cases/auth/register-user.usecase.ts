import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';
import UsersRepository from '../../../infrastructure/users.repository';
import { RegistrationUserInputDto } from '../../../api/dto/registation-user.dto';
import { CryptoService } from '../../crypto.service';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { CodeGeneratorService } from '../../code-generator.service';
import { EmailService } from '@modules/notification/email.service';
import EmailConfirmationRepository from '../../../infrastructure/email-confirmation.repository';
import { UsersEntity } from '@user-accounts/domain/users.entity';

export class RegisterUserCommand {
  constructor(public body: RegistrationUserInputDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly emailService: EmailService,
    private readonly cryptoService: CryptoService,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}
  async execute(command: RegisterUserCommand): Promise<any> {
    const existingUser = await this.usersQueryRepository.findByLoginOrEmail(command.body.email);
    if (existingUser) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with this email already exists',
        extensions: [{ field: 'email', message: 'Email already registered' }],
      });
    }

    const existingLogin = await this.usersQueryRepository.findByLoginOrEmail(command.body.login);
    if (existingLogin) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with this login already exists',
        extensions: [{ field: 'login', message: 'Login already taken' }],
      });
    }

    const confirmCode = this.codeGeneratorService.generateNumericCode(4);
    const passwordHash = await this.cryptoService.createPasswordHash(command.body.password);

    const { usersEntity, confirmation } = UsersEntity.createWithConfirmation({
      login: command.body.login,
      email: command.body.email,
      passwordHash: passwordHash,
      confirmationCode: confirmCode,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const savedUser = await this.usersRepository.save(usersEntity);

    await this.emailConfirmationRepository.create({
      userId: savedUser.getId(),
      code: confirmation.code,
      expiresAt: confirmation.expiresAt,
    });

    await this.emailService.sendConfirmationEmail(command.body.email, confirmCode);
  }
}
