import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AddStudentsDto {
  @ApiProperty({
    description: 'This is the array of students ids',
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  studentsId: number[];
}
