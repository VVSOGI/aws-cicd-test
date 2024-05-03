import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsPasswordValid } from 'src/common/validator/isPasswordValid';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @IsPasswordValid()
  @IsNotEmpty()
  password: string;
}
