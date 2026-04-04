import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from 'src/modules/user-accounts/infrastructure/users.query-repository';
import { DomainException } from '@core/exceptions/filters/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/filters/domain-exception-codes';
import { UserDataViewDto } from '../../../api/dto/user-data-view.dto';
import { UserContextDto } from '../../../dto/user-context.dto';

export class GetUserByIdQuery {
  constructor(public user: UserContextDto) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(query: GetUserByIdQuery): Promise<UserDataViewDto> {
    const userDto = await this.usersQueryRepository.findById(query.user.id);
    if (!userDto) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User not found',
      });
    }

    return userDto;
  }
}
