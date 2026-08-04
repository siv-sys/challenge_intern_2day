import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'must be a valid email' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'password is required' })
  password!: string;
}
