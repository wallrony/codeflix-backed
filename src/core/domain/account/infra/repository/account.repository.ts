import { ISearchableRepository } from '../../../../shared/domain/repository/repository-interface';
import { SearchParams } from '@core/shared/domain/repository/search-params';
import { Account } from '../../account.entity';
import { UUID } from '@core/shared/domain/value-objects';
import { SearchResult } from '@core/shared/domain/repository/search-result';

export type AccountFilter = string;

export class AccountSearchParams extends SearchParams<AccountFilter> {}

export class AccountSearchResult extends SearchResult<Account> {}

export interface IAccountRepository
  extends ISearchableRepository<
    Account,
    UUID,
    AccountFilter,
    AccountSearchParams,
    AccountSearchResult
  > {}
