import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CATEGORY_PROVIDERS } from './categories.providers';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { Category } from '@core/domain/category/category.entity';
import { UUID } from '@core/shared/domain/value-objects';
import { SearchCategoriesDTO } from './dto/search-categories.dto';
import { CategoryUseCase } from '@core/domain/category/application/category.usecase';

@Controller('/category')
export class CategoriesController {
  @Inject(CATEGORY_PROVIDERS.USE_CASE.provide)
  private usecase: CategoryUseCase;

  @Post()
  async create(
    @Body(new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    dto: CreateCategoryDto,
  ) {
    const category = await this.usecase.create(dto);
    return CategoriesController.serialize(category);
  }

  @Get()
  async search(@Query() queryParams: SearchCategoriesDTO) {
    const result = await this.usecase.search(queryParams);
    return new CategoryCollectionPresenter(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.usecase.findById(new UUID(id));
    return CategoriesController.serialize(category);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.usecase.update({ ...dto, id });
    return CategoriesController.serialize(category);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    id: string,
  ) {
    return this.usecase.delete(new UUID(id));
  }

  static serialize(output: Category) {
    return new CategoryPresenter(output);
  }
}
