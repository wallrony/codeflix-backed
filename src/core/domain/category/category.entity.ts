import { Entity } from "../entity";
import { UUID } from "../value-objects/uuid.vo";
import { CategoryFakeBuilder } from "./category-fake.builder";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
  categoryId?: UUID | null;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: Date;
};

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export class Category extends Entity {
  categoryId: UUID;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;

  constructor(props: CategoryConstructorProps) {
    super();
    this.categoryId = props.categoryId ?? new UUID();
    this.name = props.name;
    this.description = props.description ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  get entityId() {
    return this.categoryId;
  }

  // factory
  // diferente do construtor, tem a possibilidade de adicionar eventos ou regras de negócio
  static create(props: CategoryCreateCommand): Category {
    const category = new Category(props);
    category.validate();
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(["name"]);
  }

  changeDescription(description: string): void {
    this.description = description;
    this.validate(["description"]);
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, fields);
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  toJSON() {
    return {
      category_id: this.categoryId.id,
      name: this.name,
      description: this.description,
      is_active: this.isActive,
      created_at: this.createdAt,
    };
  }
}
