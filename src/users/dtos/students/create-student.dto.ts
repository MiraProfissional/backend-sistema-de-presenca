import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../users/create-user.dto';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateStudentDto extends CreateUserDto {
  @ApiProperty({
    description: 'This is the student registration number',
    example: 2021014100,
  })
  @IsInt()
  @IsNotEmpty()
  registration: number;

  @ApiProperty({
    description: "This is the user's course",
    example: 'Ciência da Computação',
  })
  @IsString()
  @IsNotEmpty()
  course: string;
}
