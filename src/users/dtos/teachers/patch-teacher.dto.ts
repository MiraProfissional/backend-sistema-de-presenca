import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({
    description: 'The ID of the user (Teacher) that needs to be updated',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
