import { Entity } from '../entity';
import { UUID } from '@core/shared/domain/value-objects';
import { Encrypt } from '@core/shared/domain/utils/bcrypt';
import { AccountValidatorFactory } from './account.validator';

type AccountConstructorProps = {
  id: UUID;
  email: string;
  password?: string;
  profileId: UUID;
  created_at?: Date;
  updated_at?: Date;
};

type AccountCreateCommnandProps = {
  id?: UUID;
  email: string;
  password: string;
  profileId?: UUID;
};

export class Account extends Entity {
  id: UUID;
  email: string;
  password?: string;
  profileId: UUID;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: AccountConstructorProps) {
    super();
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.profileId = props.profileId;
    this.createdAt = props.created_at ?? new Date();
    this.updatedAt = props.updated_at ?? new Date();
  }

  static create(props: AccountCreateCommnandProps): Account {
    const account = new Account({
      ...props,
      id: props.id ?? new UUID(),
      profileId: props.profileId ?? new UUID(),
    });
    account.validate();
    return account;
  }

  changeEmail(email: string): void {
    this.email = email;
    this.validate(['email']);
  }

  async changePassword(password: string): Promise<void> {
    const hashedPassword = await Encrypt.hash(password);
    this.password = hashedPassword;
  }

  validate(fields?: string[]) {
    const validator = AccountValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id.toString(),
      email: this.email,
      profileId: this.profileId.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
