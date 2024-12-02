import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ConnectDisciplineCameraDto {
  @ApiProperty({
    description: 'This is the id of the discipline',
    example: 23,
  })
  @IsNumber()
  @IsNotEmpty()
  idDiscipline: number;

  @ApiProperty({
    description: 'This is how much time the camera will be on in seconds',
    example: 3600,
  })
  @IsNumber()
  @IsNotEmpty()
  timeCameraOn: number;
}
