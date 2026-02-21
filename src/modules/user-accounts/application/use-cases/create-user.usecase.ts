import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../api/dto/create-user.dto';
// import { CryptoService } from '../crypto.service';
// import UsersRepository from '../../infrastructure/users.repository';
import { UserViewDto } from '../../api/dto/user-view.dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand, UserViewDto> {
  constructor() {}
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  execute(command: CreateUserCommand): UserViewDto {
    console.log(command);
    // const passwordHash = await this.cryptoService.createPasswordHash(
    //   command.dto.password,
    // );

    // const createUser = {
    //   login: command.dto.login,
    //   email: command.dto.email,
    //   passwordHash: passwordHash,
    // };

    // const entity = this.usersRepository.create(createUser);
    // await this.usersRepository.save(entity);
    // return UserViewDto.mapToView(entity);
  }
}
