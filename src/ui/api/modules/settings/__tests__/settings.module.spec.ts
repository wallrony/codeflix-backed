import { SettingsModule, CONFIG_DB_SCHEMA } from '../settings.module';
import * as Joi from 'joi';
import { Test } from '@nestjs/testing';
import { join } from 'path';

function expectValidate(schema: Joi.Schema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema Unit Tests', () => {
  describe('DB Schema', () => {
    const schema = Joi.object({
      ...CONFIG_DB_SCHEMA,
    });

    describe('DB_DIALECT', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_DIALECT" is required');

        expectValidate(schema, { DB_DIALECT: 5 }).toContain(
          '"DB_DIALECT" must be one of [sqlite, postgres]',
        );
      });

      test('valid cases', () => {
        const arrange = ['postgres', 'sqlite'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_DIALECT: value }).not.toContain(
            'DB_DIALECT',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_HOST" is required');

        expectValidate(schema, { DB_HOST: 1 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = ['some value'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_HOST: value }).not.toContain('DB_HOST');
        });
      });
    });

    describe('DB_NAME', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_DIALECT: 'sqlite' }).not.toContain(
          '"DB_NAME" is required',
        );

        expectValidate(schema, { DB_DIALECT: 'postgres' }).toContain(
          '"DB_NAME" is required',
        );

        expectValidate(schema, { DB_NAME: 1 }).toContain(
          '"DB_NAME" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_DIALECT: 'sqlite' },
          { DB_DIALECT: 'sqlite', DB_NAME: 'some value' },
          { DB_DIALECT: 'postgres', DB_NAME: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_NAME');
        });
      });
    });

    describe('DB_USERNAME', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_DIALECT: 'sqlite' }).not.toContain(
          '"DB_USERNAME" is required',
        );

        expectValidate(schema, { DB_DIALECT: 'postgres' }).toContain(
          '"DB_USERNAME" is required',
        );

        expectValidate(schema, { DB_USERNAME: 1 }).toContain(
          '"DB_USERNAME" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_DIALECT: 'sqlite' },
          { DB_DIALECT: 'sqlite', DB_USERNAME: 'some value' },
          { DB_DIALECT: 'postgres', DB_USERNAME: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_USERNAME');
        });
      });
    });

    describe('DB_PASSWORD', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_DIALECT: 'sqlite' }).not.toContain(
          '"DB_PASSWORD" is required',
        );

        expectValidate(schema, { DB_DIALECT: 'postgres' }).toContain(
          '"DB_PASSWORD" is required',
        );

        expectValidate(schema, { DB_PASSWORD: 1 }).toContain(
          '"DB_PASSWORD" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_DIALECT: 'sqlite' },
          { DB_DIALECT: 'sqlite', DB_PASSWORD: 'some value' },
          { DB_DIALECT: 'postgres', DB_PASSWORD: 'some value' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PASSWORD');
        });
      });
    });

    describe('DB_PORT', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_DIALECT: 'sqlite' }).not.toContain(
          '"DB_PORT" is required',
        );

        expectValidate(schema, { DB_DIALECT: 'postgres' }).toContain(
          '"DB_PORT" is required',
        );

        expectValidate(schema, { DB_PORT: 'a' }).toContain(
          '"DB_PORT" must be a number',
        );

        expectValidate(schema, { DB_PORT: '1.2' }).toContain(
          '"DB_PORT" must be an integer',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_DIALECT: 'sqlite' },
          { DB_DIALECT: 'sqlite', DB_PORT: 10 },
          { DB_DIALECT: 'sqlite', DB_PORT: '10' },
          { DB_DIALECT: 'postgres', DB_PORT: 10 },
          { DB_DIALECT: 'postgres', DB_PORT: '10' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PORT');
        });
      });
    });

    describe('DB_LOGGING', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_LOGGING: 'a' }).toContain(
          '"DB_LOGGING" must be a boolean',
        );
      });

      test('valid cases', () => {
        const arrange = [true, false, 'true', 'false'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_LOGGING: value }).not.toContain(
            'DB_LOGGING',
          );
        });
      });
    });

    describe('DB_AUTO_LOAD_MODELS', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_AUTO_LOAD_MODELS: 'a' }).toContain(
          '"DB_AUTO_LOAD_MODELS" must be a boolean',
        );
      });

      test('valid cases', () => {
        const arrange = [true, false, 'true', 'false'];

        arrange.forEach((value) => {
          expectValidate(schema, { DB_AUTO_LOAD_MODELS: value }).not.toContain(
            'DB_AUTO_LOAD_MODELS',
          );
        });
      });
    });
  });
});

describe('SettingsModule Unit Tests', () => {
  it('should throw an error when env vars are invalid', () => {
    try {
      Test.createTestingModule({
        imports: [
          SettingsModule.forRoot({
            envFilePath: join(__dirname, '.env.fake'),
          }),
        ],
      });
    } catch (e) {
      expect(e.message).toContain(
        '"DB_DIALECT" must be one of [sqlite, postgres]',
      );
    }
  });

  it('should be valid', () => {
    const module = Test.createTestingModule({
      imports: [SettingsModule.forRoot()],
    });

    expect(module).toBeDefined();
  });
});
