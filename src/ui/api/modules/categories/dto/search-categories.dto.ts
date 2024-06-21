import { ListCategoryInput } from '@core/domain/category/application/inputs/list-category.input';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class SearchCategoriesDTO implements ListCategoryInput {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection;
  filter?: string | null;

  toInput(): ListCategoryInput {
    return {
      page: this.page,
      per_page: this.per_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    };
  }
}
