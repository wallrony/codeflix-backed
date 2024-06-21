import { SortDirection } from '@core/shared/domain/repository/search-params';
import { CategoryFilter } from '../../infra/repository/category.repository';

export type ListCategoryInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
};
