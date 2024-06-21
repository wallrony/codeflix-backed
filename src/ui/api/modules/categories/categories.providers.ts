import { CategoryUseCase } from '@core/domain/category/application/category.usecase';
import { CategoryInMemoryRepository } from '@core/domain/category/infra/repository/in-memory/category-in-memory.repository';
import { CategorySequelizeRepository } from '@core/domain/category/infra/repository/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/domain/category/infra/repository/sequelize/category.model';
import { PossibleRepository } from '@core/shared/infra/db/typing';
import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  ValueProvider,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES: Record<
  'default' | PossibleRepository,
  ClassProvider | ValueProvider | FactoryProvider | ExistingProvider
> = {
  default: {
    provide: 'CategoryRepository',
    useExisting: CategorySequelizeRepository,
  },
  inmemory: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  sequelize: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) =>
      new CategorySequelizeRepository(categoryModel),
    inject: [getModelToken(CategoryModel)],
  },
};

export const USE_CASE:
  | ClassProvider
  | ValueProvider
  | FactoryProvider
  | ExistingProvider = {
  provide: CategoryUseCase,
  useFactory: (repository: CategorySequelizeRepository) =>
    new CategoryUseCase(repository),
  inject: [REPOSITORIES.default.provide],
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASE,
};
