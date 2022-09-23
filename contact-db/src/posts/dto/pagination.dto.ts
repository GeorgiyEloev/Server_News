import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  take: number = 10;

  @IsOptional()
  skip: number = 0;
}
