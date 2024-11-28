import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/users/enums/user-type.enum';

export class GetLinkedDisciplinesByIdDto {
  @ApiProperty({
    description: 'This is the user type (professor | aluno)',
    example: 'professor or aluno',
  })
  @IsString()
  @IsEnum(UserType)
  @IsNotEmpty()
  userType: string;
}
