import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { OperationResponse } from 'src/app/modules/operations/models/operation.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonLabel, IonItem, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { OperationStore } from '../../../store/operation.store';

@Component({
  selector: 'app-operation-item',
  templateUrl: './operation-item.component.html',
  styleUrls: ['./operation-item.component.scss'],
  
  imports: [IonItemOption, IonItemOptions, IonItem, IonLabel, IonItemSliding, UpperCasePipe, CurrencyPipe],
  standalone: true
})
export class OperationItemComponent {

  private alertService = inject(AlertService);
  private operationStore = inject(OperationStore);
  public router = inject(Router);

  public operation: any = input<OperationResponse>();
  public emitPriceChange = output();

  public openDeleteOperationAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar la operación?`, 'Esta acción no se puede deshacer')
      .then((result) => {
        if (result.isConfirmed) this.operationStore.deleteEntity(this.operation().id)
      });
  }

}
