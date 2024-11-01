import { Component, inject, input } from '@angular/core';
import { IonModal, IonContent, IonButton } from "@ionic/angular/standalone";
import { EmployeeResponse } from 'src/app/core/models/interfaces/employee.model';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-dashboard',
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonModal, HeaderComponent, UpperCasePipe, CurrencyPipe]
})
export class AccountDashboardComponent {

  public router = inject(Router);

  /* private operationService = inject(OperationService); */

  public employee = input<EmployeeResponse>();

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.

  public setInert(value: boolean) {
    this.isInert = value;
  }

  public closeAndNavigate(accountModal: any) {
    accountModal.dismiss();
    this.router.navigate(['accounts', 'form']);
  }

}
