import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { OrderResponse } from 'src/app/core/models/order.model';
import { OrderService } from 'src/app/core/services/order.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, ]
})
export class OrderItemComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private alertService = inject(AlertService);

  public order: any = input<OrderResponse>();
  public refreshDashboard = output<void>();

  public openDeleteOrderAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el pedido?')
      .fire()
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteOrder(this.order().id);
        }
      });
  }

  private deleteOrder(id: number) {
    this.orderService.deleteOrRecoverOrder(id).pipe(
      tap((response) => {
        this.alertService.getSuccessToast(response).fire();
        this.refreshDashboard.emit();
      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
