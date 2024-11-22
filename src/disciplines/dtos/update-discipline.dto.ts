import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDisciplineDto } from './create-discipline.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateDisciplineDto extends PartialType(CreateDisciplineDto) {
  @ApiProperty({
    description: 'The ID of the discipline that needs to be updated',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
