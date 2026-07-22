import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class SyncBranchesDto {
  @IsString()
  @IsNotEmpty()
  repoUrl: string;
}
