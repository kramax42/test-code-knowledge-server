import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}

export class RandomQuestionsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;
}
