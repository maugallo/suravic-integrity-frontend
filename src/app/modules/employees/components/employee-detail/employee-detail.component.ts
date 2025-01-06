import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { DatePipe } from '@angular/common';
import { EmployeeStore } from '../../stores/employee.store';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, DatePipe],
  standalone: true
})
export class EmployeeDetailComponent {

  private employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);

  public employee = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')))),
    switchMap((employeeId) => of(this.employeeStore.getEntityById(employeeId)))
  ));

}
