import { Injectable } from '@nestjs/common';
import UsersRepository from '../user-accounts/infrastructure/users.repository';
import { SessionRepository } from '../user-accounts/infrastructure/session.repository';
import { EmailConfirmationRepository } from '../user-accounts/infrastructure/email-confirmation.repository';

@Injectable()
export class DeleteAllDataService {
  constructor(
    // private readonly blogsRepository: BlogsRepository,
    // private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async clearAll(): Promise<void> {
    await Promise.all([
      // this.blogsRepository.deleteAll(),
      // this.postsRepository.deleteAll(),
      this.usersRepository.deleteAll(),
      this.sessionRepository.deleteAll(),
      this.emailConfirmationRepository.deleteAll(),
    ]);
  }
}
