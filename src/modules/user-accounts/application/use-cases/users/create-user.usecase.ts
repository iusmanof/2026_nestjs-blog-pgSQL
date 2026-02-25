import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../api/dto/create-user.dto';
import { CryptoService } from '../../crypto.service';
import UsersRepository from '../../../infrastructure/users.repository';
import { UserViewDto } from '../../../api/dto/user-view.dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, UserViewDto> {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserViewDto> {
    const passwordHash = await this.cryptoService.createPasswordHash(command.dto.password);

    const createUser = {
      login: command.dto.login,
      email: command.dto.email,
      passwordHash: passwordHash,
    };

    const entity = await this.usersRepository.create(createUser);
    return UserViewDto.mapToView(entity);
  }
}
