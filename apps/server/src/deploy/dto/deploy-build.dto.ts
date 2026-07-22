import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class DeployBuildDto {
  @IsString()
  @IsNotEmpty()
  repoUrl: string;

  @IsString()
  @IsNotEmpty()
  branch: string;

  @IsString()
  @IsNotEmpty()
  environmentPort: string;

  @IsOptional()
  @IsString()
  tempDir?: string;
}
