import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

type DB_ENV_SCHEMA = {
  DB_DIALECT: 'sqlite' | 'postgres';
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_ENV_SCHEMA> = {
  DB_DIALECT: Joi.string().required().valid('sqlite', 'postgres'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().when('DB_DIALECT', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_NAME: Joi.string().when('DB_DIALECT', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_DIALECT', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_DIALECT', {
    is: 'postgres',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().default(false),
  DB_AUTO_LOAD_MODELS: Joi.boolean().default(false),
} as const;

export type SETTINGS_ENV_SCHEMA = DB_ENV_SCHEMA;

@Module({})
export class SettingsModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    const envFilesPath: string[] = [join(process.cwd(), 'envs', '.env')];
    if (process.env.NODE_ENV) {
      envFilesPath.unshift(
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV}`),
      );
    }
    if (envFilePath) {
      envFilesPath.unshift(
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
      );
    }

    return super.forRoot({
      isGlobal: true,
      envFilePath: envFilesPath,
      validationSchema: Joi.object(CONFIG_DB_SCHEMA),
      ...otherOptions,
    });
  }
}
