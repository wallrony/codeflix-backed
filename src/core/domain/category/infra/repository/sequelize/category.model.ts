import {
  Model,
  Column,
  DataType,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { commonTableProps } from '../../../../../shared/infra/db/sequelize/common-table-props';

export type CategoryModelProps = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

@Table({
  ...commonTableProps,
  tableName: 'categories',
})
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;
}
