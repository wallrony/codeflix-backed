import { CategoryModel } from '@core/domain/category/infra/repository/sequelize/category.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SETTINGS_ENV_SCHEMA } from '../settings/settings.module';

const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<SETTINGS_ENV_SCHEMA>) => {
        const dbDialect = configService.get('DB_DIALECT');
        if (dbDialect === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            logging: configService.get('DB_LOGGING'),
            models,
          };
        } else if (dbDialect === 'postgres') {
          return {
            dialect: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            database: configService.get('DB_NAME'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            models,
          };
        }
        throw new Error(`Unsupported database configuration: ${dbDialect}`);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
