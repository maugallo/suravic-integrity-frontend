import { Component, computed, inject, signal } from '@angular/core';
import { IonContent, IonButton, IonList, IonSelectOption } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { OperationItemComponent } from "./operation-item/operation-item.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';
import { OperationStore } from '../../store/operation.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';
import { SelectInputComponent } from "../../../../shared/components/form/select-input/select-input.component";

@Component({
  selector: 'app-operation-dashboard',
  templateUrl: './operation-dashboard.component.html',
  styleUrls: ['./operation-dashboard.component.scss'],
  
  imports: [IonList, IonButton, IonContent, HeaderComponent, UpperCasePipe, CurrencyPipe, NotFoundComponent, OperationItemComponent, SelectInputComponent, IonSelectOption],
  standalone: true
})
export class OperationDashboardComponent {

  private alertService = inject(AlertService);
  private operationStore = inject(OperationStore);
  private employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public operationType = signal('todos');

  public operations = computed(() => {
    if (this.operationType() !== 'todos') {
      return this.operationStore.enabledEntities().filter(operation => operation.type === this.operationType());
    }
    return this.operationStore.enabledEntities();
  });

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('employeeId')) || undefined))
  ));

  public employee = computed(() => {
    if (this.idParam()) {
      const employee = this.employeeStore.getEntityById(this.idParam()!);
      this.operationStore.getEntities(employee.creditAccount.id);
      return employee;
    }
    return undefined;
  });

  constructor() {
    watchState(this.operationStore, () => {
      if (this.operationStore.success()) this.handleSuccess();
      if (this.operationStore.error()) this.alertService.getErrorAlert(this.operationStore.message());
    });
  }

  public receivePriceChange(price: any) { // ...
    this.employee()!.creditAccount.balance = this.employee()!.creditAccount.balance - price;
  }

  public navigate(creditAccountId: number) {
    this.router.navigate(['operations', 'form', creditAccountId]);
  }

  private handleSuccess() {
    this.employeeStore.removeCreditAccountOperation(this.employee()!.creditAccount.id, this.operationStore.lastUpdatedEntity()!);
    this.alertService.getSuccessToast(this.operationStore.message());
  }

}
