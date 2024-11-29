import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class ConnectDisciplineCameraDto {
  @ApiProperty({
    description: 'This is the id of the discipline',
    example: 23,
  })
  @IsNumber()
  @IsNotEmpty()
  idDiscipline: number;

  @ApiProperty({
    description: 'This is how much time the camera will be on',
    example: '00:15:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Time must be in the format HH:mm:ss',
  })
  timeCameraOn: string;
}
