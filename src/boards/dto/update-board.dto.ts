import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString({ each: true })
  @IsNotEmpty()
  activityDate: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  activityTime: string[];
}
