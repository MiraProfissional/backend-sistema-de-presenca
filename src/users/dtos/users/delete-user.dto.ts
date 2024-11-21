import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from 'src/users/enums/user-type.enum';

export class DeleteUsersQueryDto {
  @ApiPropertyOptional({
    description: 'User id to delete',
    example: 1234,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiPropertyOptional({
    description: 'Type of user to delete',
    example: 'professor or aluno',
  })
  @IsString()
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: string;
}
