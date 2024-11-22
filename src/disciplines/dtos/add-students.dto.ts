import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AddStudentsDto {
  @ApiProperty({
    description: 'This is the name of the discipline',
    example: 'Gerência de Projetos de Software',
  })
  @IsArray()
  @IsInt({ each: true })
  studentsId: number[];
}
