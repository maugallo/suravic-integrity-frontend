import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { OperationResponse } from 'src/app/modules/operations/models/operation.model';
import { OperationService } from 'src/app/modules/operations/services/operation.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonLabel, IonItem, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-operation-item',
  templateUrl: './operation-item.component.html',
  styleUrls: ['./operation-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonItem, IonLabel, IonItemSliding, UpperCasePipe, CurrencyPipe],
standalone: true
})
export class OperationItemComponent {

  private operationService = inject(OperationService);
  private alertService = inject(AlertService);
  public router = inject(Router);

  public operation: any = input<OperationResponse>();
  public emitPriceChange = output();

  public openDeleteOperationAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar la operación?`, 'Esta acción no se puede deshacer')
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteOperation(this.operation().id) });
  }

  private deleteOperation(id: number) {
    this.operationService.deleteOperation(id).subscribe({
      next: (response) => {
        this.emitPriceChange.emit(this.operation().total);
        this.alertService.getSuccessToast(response).fire();
      },
      error: (error) => this.alertService.getErrorAlert(error).fire()
    });
  }

}
