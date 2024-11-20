import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) -----> Not needed because of implicit convertions (main.ts)
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
