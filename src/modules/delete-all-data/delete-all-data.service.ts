import { Injectable } from '@nestjs/common';
import UsersRepository from '../user-accounts/infrastructure/users.repository';
import SessionRepository from '@user-accounts/infrastructure/session.repository';
import EmailConfirmationRepository from '@user-accounts/infrastructure/email-confirmation.repository';
import BlogsRepository from '@modules/bloggers-platform/blogs/infrastructure/blogs.repository';
import PostsRepository from '@modules/bloggers-platform/posts/infrastructure/posts.repository';
import CommentsRepository from '@modules/bloggers-platform/comments/infrastructire/comment.repository';

@Injectable()
export class DeleteAllDataService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
  ) {}

  async clearAll(): Promise<void> {
    await Promise.all([
      this.usersRepository.deleteAll(),
      this.sessionRepository.deleteAll(),
      this.emailConfirmationRepository.deleteAll(),
      this.commentsRepository.deleteAll(),
      this.commentsRepository.deleteAllCommentsLikes(),
      this.blogsRepository.deleteAll(),
      this.postsRepository.deleteAllPostLikes(),
      this.postsRepository.deleteAll(),
    ]);
  }
}
