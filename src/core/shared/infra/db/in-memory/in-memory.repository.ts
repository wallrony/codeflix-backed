import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import {
  IRepository,
  ISearchableRepository,
} from "../../../domain/repository/repository-interface";
import {
  SearchParams,
  SortDirection,
} from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  insert(entity: E): Promise<void> {
    this.items.push(entity);
    return Promise.resolve();
  }

  bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
    return Promise.resolve();
  }

  update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entityId.equals(entity.entityId)
    );
    if (index === -1) {
      return Promise.reject(
        new NotFoundError(entity.entityId, this.getEntity())
      );
    }
    this.items[index] = entity;
    return Promise.resolve();
  }

  delete(id: EntityId): Promise<boolean> {
    const index = this.items.findIndex((item) => item.entityId.equals(id));
    if (index === -1) {
      return Promise.reject(new NotFoundError(id, this.getEntity()));
    }
    this.items.splice(index, 1);
    return Promise.resolve(true);
  }

  findAll(): Promise<E[]> {
    return Promise.resolve(this.items);
  }

  findById(id: EntityId): Promise<E> {
    const item = this.items.find((item) => item.entityId.equals(id));
    if (!item) {
      return Promise.reject(new NotFoundError(id, this.getEntity()));
    }
    return Promise.resolve(item);
  }

  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];

  async search(props: SearchParams<Filter>): Promise<SearchResult<Entity>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const sortedItems = this.applySort(
      filteredItems,
      props.sort,
      props.sortDir
    );
    const paginatedItems = this.applyPaginate(
      sortedItems,
      props.page,
      props.perPage
    );
    return Promise.resolve(
      new SearchResult({
        items: paginatedItems,
        total: filteredItems.length,
        currentPage: props.page,
        perPage: props.perPage,
      })
    );
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null
  ): Promise<E[]>;

  protected applyPaginate(
    items: E[],
    page: SearchParams["page"],
    perPage: SearchParams["perPage"]
  ): E[] {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return items.slice(start, end);
  }

  protected applySort(
    items: E[],
    sort: string | null,
    sortDir: SortDirection | null,
    customGeetter?: (sort: string, item: E) => any
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      //@ts-ignore
      const aValue = customGeetter ? customGeetter(sort, a) : a[sort];
      //@ts-ignore
      const bValue = customGeetter ? customGeetter(sort, b) : b[sort];
      if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }
}
