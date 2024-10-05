import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { OrderRequest } from 'src/app/core/models/order.model';
import { OrderService } from 'src/app/core/services/order.service';
import { ProviderService } from 'src/app/core/services/provider.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { SessionService } from 'src/app/core/services/utils/session.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { IonInput, IonContent, IonButton, IonNote } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [IonNote, IonButton, IonContent, IonInput, HeaderComponent, FormsModule]
})
export class OrderFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public validationService = inject(ValidationService);
  private orderService = inject(OrderService);
  private providerService = inject(ProviderService);
  private sessionService = inject(SessionService);
  private alertService = inject(AlertService);

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public isOrderEdit!: boolean;
  public orderId!: number;

  public providers = this.providerService.providers;

  public order: Signal<OrderRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const orderId = params.get('id');
      if (this.isParameterValid(orderId)) {
        const order = this.orderService.getOrderById(Number(orderId));
        if (!order) this.router.navigate(['orders', 'dashboard']);
        this.isOrderEdit = true;
        this.orderId = order.id;
        return of({
          providerId: order.provider.id,
          userId: order.user.id,
          status: order.status,
          paymentMethod: order.paymentMethod,
          deliveryDate: order.deliveryDate,
          total: order.total,
          invoice: order.invoice,
          paymentReceipt: order.paymentReceipt
        });
      } else {
        this.isOrderEdit = false;
        return of({
          providerId: 0,
          userId: 0,
          status: '',
          paymentMethod: [],
          deliveryDate: '',
          total: '',
          invoice: new File([], ''),
          paymentReceipt: new File([], '')
        });
      }
    })
  ));

  public onProviderChange(selectedProviderId: any) {
    this.order()!.providerId = selectedProviderId;
  }

  public onSubmit(orderForm: NgForm) {
    if (!orderForm.valid) {
      orderForm.form.markAllAsTouched();
      return;
    }

    this.sessionService.getUserId().pipe(
      switchMap((userId: string) => {
        this.order()!.userId = Number(userId);
        return this.getFormOperation().pipe(
          tap((response) => this.handleSuccess(response)),
          catchError((error) => this.handleError(error))
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private getFormOperation(): Observable<any> {
    return this.isOrderEdit
      ? this.orderService.editOrder(this.orderId, this.order()!)
      : this.orderService.createOrder(this.order()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['orders', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

  public isSelectNotValid(select: NgModel, selectedValue: number) {
    return (select && select.touched && selectedValue === 0);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
