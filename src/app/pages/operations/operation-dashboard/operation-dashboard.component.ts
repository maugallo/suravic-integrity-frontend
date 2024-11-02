import { Component, inject } from '@angular/core';
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from 'src/app/core/services/operation.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { OperationItemComponent } from "./operation-item/operation-item.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, of, switchMap } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-operation-dashboard',
  templateUrl: './operation-dashboard.component.html',
  styleUrls: ['./operation-dashboard.component.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonContent, HeaderComponent, UpperCasePipe, CurrencyPipe, NotFoundComponent, OperationItemComponent]
})
export class OperationDashboardComponent {

  public router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private operationService = inject(OperationService);
  private employeeService = inject(EmployeeService);
  
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
