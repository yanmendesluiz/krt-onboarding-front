import { AccountStatus } from './account-status.enum';

export interface Account {
  id: string;
  holderName: string;
  cpf: string;
  status: AccountStatus;
}

export interface CreateAccountRequest {
  holderName: string;
  cpf: string;
  status: AccountStatus;
}

export interface UpdateAccountRequest {
  holderName: string;
  status: AccountStatus;
}
