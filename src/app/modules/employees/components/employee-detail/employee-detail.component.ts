import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-employee-detail',
    templateUrl: './employee-detail.component.html',
    styleUrls: ['./employee-detail.component.scss'],
    imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, DatePipe],
standalone: true
})
export class EmployeeDetailComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  public employee = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('id'))) {
        const employee = this.employeeService.getEmployeeById(Number(params.get('id')));
        if (!employee) this.router.navigate(['employees', 'dashboard']);
        return of(employee);
      }
      return of(null);
    })
  ));

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
