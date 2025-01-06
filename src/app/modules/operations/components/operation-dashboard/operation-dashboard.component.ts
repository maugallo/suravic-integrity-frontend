import { Component, inject } from '@angular/core';
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from '../../services/operation.service';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { OperationItemComponent } from "./operation-item/operation-item.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, of, switchMap } from 'rxjs';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';

@Component({
  selector: 'app-operation-dashboard',
  templateUrl: './operation-dashboard.component.html',
  styleUrls: ['./operation-dashboard.component.scss'],
  imports: [IonList, IonButton, IonContent, HeaderComponent, UpperCasePipe, CurrencyPipe, NotFoundComponent, OperationItemComponent],
standalone: true
})
export class OperationDashboardComponent {

  private operationService = inject(OperationService);
  private employeeStore = inject(EmployeeStore);
  public router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public operations = this.operationService.operations;

  public employee = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('employeeId'))) {
        const employee = this.employeeStore.getEntityById(Number(params.get('employeeId')));
        this.operationService.setAccountId(employee.creditAccount.id);
        return of(employee);
      }
      this.router.navigate(['employees', 'dashboard']);
      return EMPTY;
    })
  ));

  public receivePriceChange(price: any) {
    this.employee()!.creditAccount.balance = this.employee()!.creditAccount.balance - price;
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
