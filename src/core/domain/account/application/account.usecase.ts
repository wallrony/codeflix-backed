import { IAccountRepository } from '../infra/repository/account.repository';
import { Account } from '../account.entity';
import { UUID } from '@core/shared/domain/value-objects';

export class AccountUseCase {
  constructor(private readonly repository: IAccountRepository) {}

  findById(id: UUID): Promise<Account> {
    return this.repository.findById(id);
  }

  async create(input: CreateAccountInput): Promise<Account> {
    const entity = Account.create(input);
    await this.repository.insert(entity);
    return entity;
  }
}
