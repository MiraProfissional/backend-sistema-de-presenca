import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../users/create-user.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStudentDto extends CreateUserDto {
  @ApiProperty({
    description: "This is the user's course",
    example: 'Ciência da Computação',
  })
  @IsString()
  @IsNotEmpty()
  course: string;
}
