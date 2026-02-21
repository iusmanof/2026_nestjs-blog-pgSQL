import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import UsersRepository from '../../infrastructure/users.repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand, void> {
  constructor() {}
  execute(command: DeleteUserCommand): Promise<void> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
  // execute(command: DeleteUserCommand): void {
  //   // eslint-disable-next-line @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions
  //   console.log(`execute: ${command}`);
  //   // const isDeleted = await this.usersRepository.delete(command.id);
  //   //
  //   // if (!isDeleted) {
  //   //   throw new DomainException({
  //   //     code: DomainExceptionCode.NotFound,
  //   //     message: 'User not found',
  //   //   });
  //   // }
  // }
}
