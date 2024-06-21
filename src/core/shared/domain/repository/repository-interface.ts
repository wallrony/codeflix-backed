import { ValueObject } from '../value-object';
import { Entity } from '../../../domain/entity';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert?(entity: E[]): Promise<void>;
  update(entity: E): Promise<boolean>;
  delete(id: EntityId): Promise<boolean>;

  findAll?(): Promise<E[]>;
  findById(id: EntityId): Promise<E>;

  getEntity(): new (...args: any[]) => E;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject = ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
