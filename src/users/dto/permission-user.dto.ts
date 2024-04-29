import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPermissionDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['user', 'admin'])
  permission: string;
}
