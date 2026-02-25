import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserCommand } from '../../application/use-cases/users/create-user.usecase';
import { DeleteUserCommand } from '../../application/use-cases/users/delete-user.usecase';
import { GetUsersQuery } from '../../application/queries/users/get-users.query-handler';
import { UsersQueryParamsDto } from '../dto/users-query-params.dto';
import { BasicAuthGuard } from '../../guards/basic/basic.guard';
// import { BasicAuthGuard } from '../../guards/basic/basic-auth.guard';

@UseGuards(BasicAuthGuard)
@Controller('users')
class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return this.commandBus.execute<CreateUserCommand, CreateUserDto>(new CreateUserCommand(dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllUsers(@Query() query: UsersQueryParamsDto) {
    return this.queryBus.execute(new GetUsersQuery(query));
  }
}

export default UserController;
