import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDisciplineDto {
  @ApiProperty({
    description: 'This is the name of the discipline',
    example: 'Gerência de Projetos de Software',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'This is the code of the discipline',
    example: 'SDES06',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description:
      "This is the camera's ip responsible to capture the discipline's students",
    example: '192.168.1.101',
  })
  @IsString()
  @IsNotEmpty()
  ipCamera: string;

  @ApiProperty({
    description: 'Start time of the discipline (HH:MM format)',
    example: '07:55',
  })
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in the format HH:MM',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the discipline (HH:MM format)',
    example: '9:45',
  })
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in the format HH:MM',
  })
  endTime: string;
}
