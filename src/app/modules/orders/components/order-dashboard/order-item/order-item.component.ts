import { Component, inject, input } from '@angular/core';
import { OrderResponse } from 'src/app/modules/orders/models/order.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrderStore } from '../../../stores/order.store';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, DatePipe],
  standalone: true
})
export class OrderItemComponent {

  private alertService = inject(AlertService);
  private orderStore = inject(OrderStore);
  public router = inject(Router);

  public order: any = input<OrderResponse>();

  public openDeleteOrRecoverOrderAlert() {
    const action = this.order().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.order().isEnabled ? 'ELIMINAR' : 'ACEPTAR';

    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el pedido?`, '', confirmLabel)
      .then((result: any) => {
        if (result.isConfirmed)
          this.orderStore.deleteEntity(this.order().id);
      });
  }

}
