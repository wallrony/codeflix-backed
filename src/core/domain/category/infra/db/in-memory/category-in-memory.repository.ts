import { SortDirection } from "../../../../../shared/domain/repository/search-params";
import { InMemorySearchableRepository } from "../../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../../category.entity";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Category["categoryId"]
> {
  sortableFields: string[] = ["name", "createdAt"];

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected applyFilter(
    items: Category[],
    filter: string
  ): Promise<Category[]> {
    if (!filter) return Promise.resolve(items);
    return Promise.resolve(
      items.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }

  protected applySort(
    items: Category[],
    sort?: string,
    sortDir?: SortDirection,
    customGeetter?: (sort: string, item: Category) => any
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sortDir, customGeetter)
      : super.applySort(items, "createdAt", "desc", customGeetter);
  }
}
