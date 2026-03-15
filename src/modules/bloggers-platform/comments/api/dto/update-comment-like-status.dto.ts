import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '@core/decorators/transform/trim';
import type { LikeStatus } from '../../../posts/types/like-status.type';

export class UpdateCommentLikeStatusDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Like', 'Dislike', 'None'])
  likeStatus: LikeStatus;
}
