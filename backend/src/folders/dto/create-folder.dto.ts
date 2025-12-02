import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @MinLength(1, { message: 'Folder name is required' })
  @MaxLength(100, { message: 'Folder name is too long' })
  name: string;
}

export class UpdateFolderDto {
  @IsString()
  @MinLength(1, { message: 'Folder name is required' })
  @MaxLength(100, { message: 'Folder name is too long' })
  name: string;
}