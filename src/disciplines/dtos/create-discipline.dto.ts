import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
}
