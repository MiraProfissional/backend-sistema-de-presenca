import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'This is the refreshToken',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
