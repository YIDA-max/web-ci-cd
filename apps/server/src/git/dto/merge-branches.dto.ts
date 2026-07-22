import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class MergeBranchesDto {
  @IsString()
  @IsNotEmpty()
  tempDir: string;

  @IsString()
  @IsNotEmpty()
  sourceBranch: string;

  @IsArray()
  @IsString({ each: true })
  allBranches: string[];
}
