import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '@core/decorators/transform/trim';

export class UpdateBlogDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(/^https:\/\/.+/, {
    message: 'websiteUrl must be a valid URL',
  })
  websiteUrl: string;
}
