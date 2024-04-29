import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Priority } from '../type/types';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  commitUrl: string;

  @IsEnum(Priority)
  priority: Priority;
}
