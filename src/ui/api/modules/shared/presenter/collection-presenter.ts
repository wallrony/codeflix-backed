import { PaginationOutput } from '@core/shared/application/pagination-output';
import { Transform } from 'class-transformer';

export abstract class CollectionPresenter {
  @Transform(({ value }) => parseInt(value))
  current_page: number;
  @Transform(({ value }) => parseInt(value))
  total: number;
  @Transform(({ value }) => parseInt(value))
  per_page: number;

  constructor(output: PaginationOutput) {
    const { total, currentPage, perPage } = output;
    this.total = total;
    this.current_page = currentPage;
    this.per_page = perPage;
  }

  abstract get data();
}
