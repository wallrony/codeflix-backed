import { IsOptional, IsString, MaxLength } from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Notification } from "../../shared/domain/validators/notification";

export class CategoryRules {
  @MaxLength(255, { groups: ["name"] })
  name: string;

  @IsOptional({ groups: ["description"] })
  @IsString({ groups: ["description"] })
  description: string | null;

  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Category,
    fields?: string[]
  ): boolean {
    const newFields = fields?.length ? fields : ["name", "description"];
    return super.validate(notification, new CategoryRules(data), newFields);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
