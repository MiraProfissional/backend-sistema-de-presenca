import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchStudentDto extends PartialType(CreateStudentDto) {
  @ApiProperty({
    description: 'The ID of the user (Student) that needs to be updated',
    example: '1',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
