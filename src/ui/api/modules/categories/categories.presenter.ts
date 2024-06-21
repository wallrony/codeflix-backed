import { Category } from '@core/domain/category/category.entity';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared/presenter/collection-presenter';
import { PaginationOutput } from '@core/shared/application/pagination-output';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;
  updated_at: Date;

  constructor(output: Category) {
    this.id = output.id.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.isActive;
    this.created_at = output.createdAt;
    this.updated_at = output.updatedAt;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: PaginationOutput<Category>) {
    super(output);
    this.data = output.items.map((category) => new CategoryPresenter(category));
  }
}
