import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountStatus } from '../../../core/models/account-status.enum';
import { AccountService } from '../../../core/services/account.service';

import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  form: FormGroup;
  accountId = '';
  isEditMode = false;
  loading = false;
  saving = false;
  errorMessage = '';

  readonly statuses = [
    { value: AccountStatus.Active, description: 'Ativa' },
    { value: AccountStatus.Inactive, description: 'Inativa' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly accountService: AccountService,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      holderName: ['', [Validators.required, Validators.maxLength(150)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      status: [AccountStatus.Active, Validators.required]
    });
  }

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id') || '';
    this.isEditMode = !!this.accountId;

    if (this.isEditMode) {
      this.loadAccount();
    }
  }

  loadAccount(): void {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getById(this.accountId).subscribe({
      next: account => {
        this.form.patchValue({
          holderName: account.holderName,
          cpf: account.cpf,
          status: account.status
        });

        this.form.get('cpf')?.disable();
        this.loading = false;
      },
      error: error => {
        this.errorMessage = this.getErrorMessage(error);
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.updateAccount();
      return;
    }

    this.createAccount();
  }

private createAccount(): void {
  this.accountService.create(this.form.getRawValue()).subscribe({
    next: () => {
      this.notification.success('Conta cadastrada com sucesso!');

      setTimeout(() => {
        this.router.navigate(['/accounts']);
      }, 800);
    },
    error: error => {
      this.errorMessage = this.getErrorMessage(error);
      this.notification.error(this.errorMessage || 'Erro ao cadastrar conta.');
      this.saving = false;
    }
  });
}

private updateAccount(): void {
  const request = {
    holderName: this.form.get('holderName')?.value,
    cpf: this.form.get('cpf')?.value,
    status: Number(this.form.get('status')?.value)
  };

  this.accountService.update(this.accountId, request).subscribe({
    next: () => {
      this.notification.success('Conta atualizada com sucesso!');

      setTimeout(() => {
        this.router.navigate(['/accounts']);
      }, 800);
    },
    error: error => {
      this.errorMessage = this.getErrorMessage(error);
      this.notification.error(this.errorMessage || 'Erro ao atualizar conta.');
      this.saving = false;
    }
  });
}

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
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
