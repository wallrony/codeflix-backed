import {
  SearchParams,
  SortDirection,
} from '../../../../../shared/domain/repository/search-params';
import { SearchResult } from '../../../../../shared/domain/repository/search-result';
import { NotFoundError } from '../../../../errors/not-found.error';
import { UUID } from '../../../../../shared/domain/value-objects';
import { Category } from '../../../category.entity';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../category.repository';
import { CategoryModel } from './category.model';
import { Op, OrderItem, literal } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import { CategoryModelMapper } from './category-mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'is_active', 'created_at', 'updated_at'];
  orderBy: Record<string, Record<string, (...args: any[]) => Literal>> = {
    postgres: {
      name: (sortDir: SortDirection) => literal(`name ${sortDir}`), //ascii
    },
    sqlite: {
      name: (sortDir: SortDirection) => literal(`name ${sortDir}`), //ascii
    },
  };

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(model.toJSON());
  }

  async bulkInsert(entity: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entity.map(CategoryModelMapper.toModel).map((item) => item.toJSON()),
    );
  }

  async update(entity: Category): Promise<boolean> {
    const serializedData = CategoryModelMapper.toModel(entity).toJSON();
    delete serializedData['id'];
    delete serializedData['created_at'];
    delete serializedData['updated_at'];
    const [affectedRows] = await this.categoryModel.update(serializedData, {
      where: {
        id: entity.id.id,
      },
    });
    return affectedRows > 0;
  }

  async delete(id: UUID): Promise<boolean> {
    const affectedRows = await this.categoryModel.destroy({
      where: { id: id.id },
    });
    return affectedRows > 0;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel
      .findAll()
      .then((categories) => categories.map(CategoryModelMapper.toEntity));
  }

  async findById(id: UUID): Promise<Category> {
    const category = await this._get(id);
    return CategoryModelMapper.toEntity(category);
  }

  async search(props: SearchParams<string>): Promise<SearchResult<Category>> {
    const offset = (props.page - 1) * props.perPage;
    const limit = props.perPage;
    const where = this.formatFindAllWhere(props.filter);
    const order = this.formatFindAllSort(props.sort, props.sortDir);
    const { rows, count } = await this.categoryModel.findAndCountAll({
      limit,
      offset,
      ...order,
      ...where,
    });
    return new CategorySearchResult({
      items: rows.map(CategoryModelMapper.toEntity),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
    });
  }

  private async _get(id: UUID): Promise<CategoryModel> {
    const category = await this.categoryModel.findByPk(id.id);
    if (!category) {
      throw new NotFoundError(id, this.getEntity());
    }
    return category;
  }

  private formatFindAllWhere(filter: CategorySearchParams['filter']) {
    if (!filter) return {};
    return {
      where: {
        name: {
          [Op.like]: `%${filter}%`,
        },
      },
    };
  }

  private formatFindAllSort(
    sort: CategorySearchParams['sort'],
    sortDir: CategorySearchParams['sortDir'],
  ) {
    const dialect = this.categoryModel.sequelize.getDialect();
    const sortArgs: OrderItem[] = [];
    if (!sort || !this.sortableFields.includes(sort)) {
      sortArgs.push(['created_at', 'desc']);
    } else if (!!this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return { order: this.orderBy[dialect][sort](sortDir) };
    } else {
      sortArgs.push([sort, sortDir]);
    }
    return {
      order: sortArgs,
    };
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
