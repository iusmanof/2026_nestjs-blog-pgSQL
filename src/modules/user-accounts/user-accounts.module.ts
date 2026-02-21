import { Module } from '@nestjs/common';
import UserController from './api/controllers/users.controller';
import { CryptoService } from './application/crypto.service';
import { GetUsersQueryHandler } from './application/queries/get-users.query-handler';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import UsersRepository from './infrastructure/users.repository';
import { CqrsModule } from '@nestjs/cqrs';

const controllers = [UserController];
const services = [CryptoService];
const repositories = [UsersQueryRepository, UsersRepository];
const useCases = [CreateUserUseCase, DeleteUserUseCase];
const handlers = [GetUsersQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [
    ...services,
    ...repositories,
    // ...strategies,
    ...useCases,
    ...handlers,
  ],
  exports: [],
})
export class UserAccountsModule {}
