import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '@core/decorators/transform/trim';

export class CreateCommentDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
