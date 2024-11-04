import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeResponse } from 'src/app/core/models/interfaces/employee.model';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonButton } from "@ionic/angular/standalone";
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { OperationDashboardComponent } from 'src/app/pages/operations/operation-dashboard/operation-dashboard.component';
import { RegisterFaceModalComponent } from "../../../facial-recognition/register-face-modal/register-face-modal.component";

@Component({
  selector: 'app-employee-item',
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
  standalone: true,
  imports: [IonButton, IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, UpperCasePipe, TitleCasePipe, OperationDashboardComponent, RegisterFaceModalComponent]
})
export class EmployeeItemComponent {

  public router = inject(Router);

  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);

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
