import { IsEmail } from 'class-validator';
import { Account } from './account.entity';
import { ClassValidatorFields } from '@core/shared/domain/validators/class-validator-fields';
import { Notification } from '@core/shared/domain/validators/notification';

export class AccountRules {
  @IsEmail(undefined, { groups: ['email'] })
  email: string;

  constructor(entity) {
    Object.assign(this, entity);
  }
}

export class AccountValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Account,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['name', 'description'];
    return super.validate(notification, new AccountRules(data), newFields);
  }
}

export class AccountValidatorFactory {
  static create() {
    return new AccountValidator();
  }
}
