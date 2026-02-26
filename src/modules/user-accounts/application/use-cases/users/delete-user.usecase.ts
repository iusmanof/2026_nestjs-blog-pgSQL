import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import UsersRepository from '../../../infrastructure/users.repository';
import { DomainException } from '../../../../../core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { UsersQueryRepository } from '../../../infrastructure/users.query-repository';

export class DeleteUserCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}
  async execute(command: DeleteUserCommand): Promise<void> {
    const user = await this.usersQueryRepository.findById(command.id);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
        extensions: [{ field: 'query id', message: 'Id not found' }],
      });
    }

    await this.usersRepository.delete(command.id);
  }
}
