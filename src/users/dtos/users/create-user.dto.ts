import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsISO8601,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'This is the name for the user',
    example: 'Gustavo Gimenes',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @ApiProperty({
    description: "This is the user's email",
    example: 'GustavoGimenes@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @ApiProperty({
    description:
      "This is the user's password. Must have minimum eight characters, at least one letter, one number and one special character ",
    example: 'Gust@vo123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    description: "This is the user's birthday (ISO8601 format)",
    example: '2001-03-16T07:46:32+00:00',
  })
  @IsISO8601()
  @IsNotEmpty()
  dateBirth: string;

  @ApiProperty({
    description: "This is the user's document (CPF)",
    example: '44455566678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;

  @ApiProperty({
    description: "This is the user's cellphone",
    example: '12987654321',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cellphone: string;

  @ApiProperty({
    description: "This is the user's identifier number",
    example: 123456789,
  })
  @IsInt()
  @IsNotEmpty()
  registrationNumber: number;
}
