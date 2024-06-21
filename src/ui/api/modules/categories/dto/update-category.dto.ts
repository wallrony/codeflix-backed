import { UpdateCategoryInput } from '@core/domain/category/application/inputs/update-category.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends OmitType(UpdateCategoryInput, [
  'id',
] as const) {}
