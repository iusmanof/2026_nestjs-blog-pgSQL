import { Injectable } from '@nestjs/common';
import UsersRepository from '../user-accounts/infrastructure/users.repository';

@Injectable()
export class DeleteAllDataService {
  constructor(
    // private readonly blogsRepository: BlogsRepository,
    // private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    // private readonly sessionRepository: SessionRepository,
  ) {}

  async clearAll(): Promise<void> {
    await Promise.all([
      // this.blogsRepository.deleteAll(),
      // this.postsRepository.deleteAll(),
      this.usersRepository.deleteAll(),
      // this.sessionRepository.deleteAll(),
    ]);
  }
}
