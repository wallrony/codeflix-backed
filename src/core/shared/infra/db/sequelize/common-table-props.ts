import { Model } from 'sequelize';
import { TableOptions } from 'sequelize-typescript';

export const commonTableProps: TableOptions<Model<any, any>> = {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  freezeTableName: true,
} as const;
