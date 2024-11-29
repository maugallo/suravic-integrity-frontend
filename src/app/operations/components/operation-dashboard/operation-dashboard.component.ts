import { Component, inject } from '@angular/core';
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from '../../services/operation.service';
import { NotFoundComponent } from 'src/shared/components/not-found/not-found.component';
import { OperationItemComponent } from "./operation-item/operation-item.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, of, switchMap } from 'rxjs';
import { EmployeeService } from 'src/app/employees/services/employee.service';

@Component({
  selector: 'app-operation-dashboard',
  templateUrl: './operation-dashboard.component.html',
  styleUrls: ['./operation-dashboard.component.scss'],
  imports: [IonList, IonButton, IonContent, HeaderComponent, UpperCasePipe, CurrencyPipe, NotFoundComponent, OperationItemComponent]
})
export class OperationDashboardComponent {

  private operationService = inject(OperationService);
  private employeeService = inject(EmployeeService);
  public router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public operations = this.operationService.operations;

  public employee = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('employeeId'))) {
        const employee = this.employeeService.getEmployeeById(Number(params.get('employeeId')));
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
