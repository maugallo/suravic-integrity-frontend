import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { OperationResponse } from 'src/app/core/models/interfaces/operation.model';
import { OperationService } from 'src/app/core/services/operation.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonLabel, IonItem, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonItem, IonLabel, IonItemSliding, UpperCasePipe, CurrencyPipe]
})
export class AccountItemComponent {

  public router = inject(Router);

  private operationService = inject(OperationService);
  private alertService = inject(AlertService);

  public operation: any = input<OperationResponse>();
  public modal: any = input<any>();

  public openDeleteOperationAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar la operación?`, 'Esta acción no se puede deshacer')
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteOperation(this.operation().id) });
  }

  public closeAndNavigate() {
    this.modal().dismiss();
    this.router.navigate(['accounts', 'form', this.operation().creditAccount.id, this.operation().id])
  }

  private deleteOperation(id: number) {
    this.operationService.deleteOperation(id).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => this.alertService.getErrorAlert(error).fire()
    });
  }

}
