import { Component, OnInit } from '@angular/core';

import { Account } from '../../../core/models/account.model';
import { AccountStatus } from '../../../core/models/account-status.enum';
import { AccountService } from '../../../core/services/account.service';

import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private readonly accountService: AccountService, private readonly notification: NotificationService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

loadAccounts(): void {
  this.loading = true;

  this.accountService.getAll().subscribe({
    next: accounts => {
      this.accounts = accounts;
      this.loading = false;
    },
    error: error => {
      const message = this.getErrorMessage(error);
      this.notification.error(message || 'Erro ao carregar contas.');
      this.loading = false;
    }
  });
}

deleteAccount(account: Account): void {
  const confirmed = confirm(`Deseja excluir a conta de ${account.holderName}?`);

  if (!confirmed) {
    return;
  }

  this.accountService.delete(account.id).subscribe({
    next: () => {
      this.notification.success('Conta excluída com sucesso.');
      this.loadAccounts();
    },
    error: error => {
      this.errorMessage = this.getErrorMessage(error);
      this.notification.error(this.errorMessage || 'Erro ao excluir conta.');
    }
  });
}

  getStatusDescription(status: AccountStatus): string {
    return status === AccountStatus.Active ? 'Ativa' : 'Inativa';
  }

  private getErrorMessage(error: any): string {
    if (error && error.error && error.error.error) {
      return error.error.error;
    }

    if (error && error.message) {
      return error.message;
    }

    return 'Não foi possível processar a solicitação.';
  }
}
