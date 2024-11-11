import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsISO8601,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'This is the name for the teacher',
    example: 'Gustavo Gimenes',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  name: string;

  @ApiProperty({
    description: "This is the teacher's email",
    example: 'GustavoGimenes@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @ApiProperty({
    description:
      "This is the teacher's password. Must have minimum eight characters, at least one letter, one number and one special character ",
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
    description: "This is the teacher's birthday (ISO8601 format)",
    example: '2001-03-16T07:46:32+00:00',
  })
  @IsISO8601()
  @IsNotEmpty()
  dateBirth: string;

  @ApiProperty({
    description: "This is the teacher's document (CPF)",
    example: '44455566678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;

  @ApiProperty({
    description: "This is the teacher's cellphone",
    example: '12987654321',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  cellphone: string;
}
