import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(1, { message: 'Tag name is required' })
  @MaxLength(50, { message: 'Tag name is too long (max 50 characters)' })
  name: string;
}