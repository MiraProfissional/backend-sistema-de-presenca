import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDisciplineDto {
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  ipCamera: string;
}
