import { UUID } from '@core/shared/domain/value-objects';
import {
  CategorySearchParams,
  ICategoryRepository,
} from '../infra/repository/category.repository';
import { Category } from '../category.entity';
import { ListCategoryInput } from './inputs/list-category.input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application/pagination-output';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

export class CategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async findById(id: UUID): Promise<Category> {
    return await this.repository.findById(id);
  }

  async search(input: ListCategoryInput): Promise<PaginationOutput<Category>> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.repository.search(params);
    return PaginationOutputMapper.toOutput(searchResult.items, searchResult);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const entity = Category.create(input);
    await this.repository.insert(entity);
    return entity;
  }

  async update(input: UpdateCategoryInput): Promise<Category> {
    const id = new UUID(input.id);
    const category = await this.repository.findById(id);

    if (!category) {
      throw new NotFoundError(id, Category);
    }
    input.name && category.changeName(input.name);
    if (input.description !== undefined) {
      category.changeDescription(input.description);
    }
    if (input.is_active === true) {
      category.activate();
    } else if (input.is_active === false) {
      category.deactivate();
    }
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    await this.repository.update(category);
    return category;
  }

  async delete(id: UUID): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
