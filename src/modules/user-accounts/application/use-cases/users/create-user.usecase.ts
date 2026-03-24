import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../api/dto/create-user.dto';
import { CryptoService } from '../../crypto.service';
import UsersRepository from '../../../infrastructure/users.repository';
import { UserViewDto } from '../../../api/dto/user-view.dto';
import { UsersEntity } from '@user-accounts/domain/users.entity';

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
    const user = UsersEntity.create(createUser);

    await this.usersRepository.save(user);
    return UserViewDto.mapToView(user);

    // const entity = await this.usersRepository.create(createUser);
    // return UserViewDto.mapToView(entity);
  }
}
