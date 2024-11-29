import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeResponse } from 'src/app/employees/models/employee.model';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { AlertService } from 'src/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonButton } from "@ionic/angular/standalone";
import { UpperCasePipe } from '@angular/common';
import { RegisterFaceModalComponent } from 'src/app/facial-recognition/components/register-face-modal/register-face-modal.component';

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
  imports: [IonButton, IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, UpperCasePipe, RegisterFaceModalComponent]
})
export class EmployeeItemComponent {

  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);
  public router = inject(Router);

  public employee: any = input<EmployeeResponse>();

  public openDeleteOrRecoverEmployeeAlert() {
    const action = this.employee().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.employee().isEnabled ? 'ELIMINAR' : 'ACEPTAR';

    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el empleado?`, '', confirmLabel)
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteOrRecoverEmployee(this.employee().id) });
  }

  private deleteOrRecoverEmployee(id: number) {
    this.employeeService.deleteOrRecoverEmployee(id).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => {
        this.alertService.getErrorAlert(error).fire();
        console.log(error);
      }
    });
  }

}
