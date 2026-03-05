import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '@core/decorators/transform/trim';

export class UpdatePostForBlogDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
