import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: "This is the user's email",
    example: 'GustavoGimenes@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      "This is the user's password. Must have minimum eight characters, at least one letter, one number and one special character ",
    example: 'Gust@vo123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
