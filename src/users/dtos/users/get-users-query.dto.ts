import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { UserType } from 'src/users/enums/user-type.enum';

class GetUsersQueryBaseDto {
  @ApiPropertyOptional({
    description: 'Get teacher or students users',
    example: 'professor or aluno',
  })
  @IsString()
  @IsEnum(UserType)
  @IsOptional()
  userType?: string;
}

export class GetUsersQueryDto extends IntersectionType(
  GetUsersQueryBaseDto,
  PaginationQueryDto,
) {}
