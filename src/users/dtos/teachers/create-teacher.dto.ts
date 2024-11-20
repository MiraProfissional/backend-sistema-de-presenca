import { IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../users/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto extends CreateUserDto {
  @ApiProperty({
    description: "This is the teacher's identifier number",
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
