import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';

export class PatchTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({
    description: 'The ID of the teacher that needs to be updated',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
