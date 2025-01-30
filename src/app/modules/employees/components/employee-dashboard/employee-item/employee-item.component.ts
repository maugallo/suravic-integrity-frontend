import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeResponse } from 'src/app/modules/employees/models/employee.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonButton } from "@ionic/angular/standalone";
import { UpperCasePipe } from '@angular/common';
import { RegisterFaceModalComponent } from 'src/app/modules/facial-recognition/components/register-face-modal/register-face-modal.component';
import { EmployeeStore } from '../../../stores/employee.store';

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
  imports: [IonButton, IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, UpperCasePipe, RegisterFaceModalComponent],
  standalone: true
})
export class EmployeeItemComponent {

  private employeeStore = inject(EmployeeStore);
  private alertService = inject(AlertService);
  public router = inject(Router);

  public employee: any = input<EmployeeResponse>();
  public role = input();

  public openDeleteOrRecoverEmployeeAlert() {
    const action = this.employee().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.employee().isEnabled ? 'ELIMINAR' : 'ACEPTAR';

    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el empleado?`, '', confirmLabel)
      .then((result: any) => {
        if (result.isConfirmed)
          this.employeeStore.deleteEntity(this.employee().id);
      });
  }

}
