import { IsEmail } from 'class-validator';

export class PasswordRecoveryDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
