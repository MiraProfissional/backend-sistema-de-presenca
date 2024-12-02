import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class PresentStudentsDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      type: 'Registration',
    },
  })
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  presentStudents: number[];
}
