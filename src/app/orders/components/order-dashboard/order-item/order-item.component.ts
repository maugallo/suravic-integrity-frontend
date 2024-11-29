import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderResponse } from 'src/app/orders/models/order.model';
import { OrderService } from 'src/app/orders/services/order.service';
import { AlertService } from 'src/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, DatePipe]
})
export class OrderItemComponent {

  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private alertService = inject(AlertService);
  public router = inject(Router);
  
  public order: any = input<OrderResponse>();
  public refreshDashboard = output<void>();

  public openDeleteOrRecoverOrderAlert() {
    const action = this.order().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.order().isEnabled ? 'ELIMINAR' : 'ACEPTAR';

    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el producto?`, '', confirmLabel)
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteOrRecoverOrder(this.order().id) });
  }

  private deleteOrRecoverOrder(id: number) {
    this.orderService.deleteOrRecoverOrder(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => console.log(error)
    });
  }

}
