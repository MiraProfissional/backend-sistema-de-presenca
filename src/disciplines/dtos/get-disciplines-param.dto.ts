import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetDisciplinesParamDto {
  @ApiPropertyOptional({
    description: 'Get discipline with a specific id',
    example: 4321,
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
