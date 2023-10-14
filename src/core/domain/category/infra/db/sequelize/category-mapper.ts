import { UUID } from "../../../../../shared/domain/value-objects";
import { Category } from "../../../category.entity";
import { CategoryModel } from "./category.model";

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.categoryId.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const entity = new Category({
      categoryId: new UUID(model.category_id),
      name: model.name,
      description: model.description,
      isActive: model.is_active,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
    entity.validate();
    return entity;
  }
}
