import { Component, effect, inject, input, OnInit } from '@angular/core';
import { IonModal, IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { EmployeeResponse } from 'src/app/core/models/interfaces/employee.model';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OperationService } from 'src/app/core/services/operation.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { AccountItemComponent } from "./account-item/account-item.component";

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonContent, IonModal, HeaderComponent, UpperCasePipe, CurrencyPipe, NotFoundComponent, AccountItemComponent]
})
export class AccountDashboardComponent {

  public router = inject(Router);

  private operationService = inject(OperationService);

  public employee = input<EmployeeResponse>();

  public operations = this.operationService.operations;
  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.

  constructor() {
    effect(() => {
      if (this.employee()) {
        this.operationService.setAccountId(this.employee()!.creditAccount.id);
      }
    });
  }

  public setInert(value: boolean) {
    this.isInert = value;
  }

  public closeAndNavigate(accountModal: any) {
    accountModal.dismiss();
    this.router.navigate(['accounts', 'form', this.employee()?.creditAccount.id]);
  }

}
