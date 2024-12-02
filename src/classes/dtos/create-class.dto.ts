import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({
    description: 'This is how much time the camera was on in seconds',
    example: 3600,
  })
  @IsInt()
  @IsNotEmpty()
  timeCameraWasOn: number;

  @ApiProperty({
    description: 'This is the id of the discipline',
    example: 23,
  })
  @IsInt()
  @IsNotEmpty()
  disciplineId: number;
}
