import { IRepository } from "../../shared/domain/repository/repository-interface";
import { UUID } from "../value-objects/uuid.vo";
import { Category } from "./category.entity";

export interface CategoryRepository extends IRepository<Category, UUID> {}
