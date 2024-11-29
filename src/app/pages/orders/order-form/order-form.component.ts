import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { OrderRequest } from 'src/app/core/models/interfaces/order.model';
import { OrderService } from 'src/app/core/services/order.service';
import { ProviderService } from 'src/app/core/services/provider.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { Photo } from '@capacitor/camera';
import { WheelDateInputComponent } from "../../../shared/components/form/wheel-date-input/wheel-date-input.component";
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";
import { SelectInputComponent } from "../../../shared/components/form/select-input/select-input.component";
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { OrderMapper } from 'src/app/core/models/mappers/order.mapper';
import { EntitiesUtility } from 'src/app/core/models/utils/entities.utility';
import { StorageType } from 'src/app/core/models/enums/storage-type.enum';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { FileInputComponent } from "../../../shared/components/form/file-input/file-input.component";
import { FileUtility } from 'src/app/core/models/utils/file.utility';
import { PaymentMethodService } from 'src/app/core/services/payment-method.service';
import { OrderStatus } from 'src/app/core/models/enums/order-status.enum';

@Component({
    selector: 'app-order-form',
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.scss'],
    imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, WheelDateInputComponent, NumberInputComponent, SelectInputComponent, SubmitButtonComponent, FileInputComponent]
})
export class OrderFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private orderService = inject(OrderService);
  private paymentMethodService = inject(PaymentMethodService);
  private providerService = inject(ProviderService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);

  public today = new Date().toISOString().split('T')[0];

  public isOrderEdit!: boolean;
  public orderId!: number;

  public orderStatus = OrderStatus;
  public providers = this.providerService.providers;
  public paymentMethods = this.paymentMethodService.paymentMethods;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent | WheelDateInputComponent>;

  public order: Signal<OrderRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const orderId = params.get('id');
      if (this.isParameterValid(orderId)) {
        const order = this.orderService.getOrderById(Number(orderId));
        if (!order) {
          this.router.navigate(['orders', 'dashboard']);
          return EMPTY; // Nos aseguramos de no continuar si la orden no existe
        }
        this.isOrderEdit = true;
        this.orderId = order.id;
        const orderRequest = OrderMapper.toOrderRequest(order);
        return this.orderService.getInvoiceFile(this.orderId).pipe(
          tap(async (invoice) => (invoice.type.startsWith('image/'))
            ? orderRequest.invoice = await FileUtility.getPhotoFromBlob(invoice)
            : orderRequest.invoice = FileUtility.getFileFromBlob(invoice, 'factura')),
          switchMap(() => {
            if (order.status === OrderStatus.PAGO) {
              return this.orderService.getPaymentReceiptFile(this.orderId).pipe(
                tap(async (paymentReceipt) => {
                  if (paymentReceipt && paymentReceipt.size > 0) {
                    (paymentReceipt.type.startsWith('image/'))
                      ? orderRequest.paymentReceipt = await FileUtility.getPhotoFromBlob(paymentReceipt)
                      : orderRequest.paymentReceipt = FileUtility.getFileFromBlob(paymentReceipt, 'comprobante')
                  }
                }),
                map(() => orderRequest)
              );
            }
            return of(orderRequest);
          })
        );
      } else {
        this.isOrderEdit = false;
        return of(EntitiesUtility.getEmptyOrderRequest());
      }
    })
  ));

  public onProviderChange(selectedProviderId: any) {
    this.order()!.providerId = selectedProviderId;
  }

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (!this.order()!.invoice) {
      this.alertService.getErrorToast("Debes cargar una imagen o archivo para la factura de pedido").fire();
      return;
    }

    this.storageService.getStorage(StorageType.USER_ID).pipe(
      switchMap((userId) => {
        const order = this.order()!;
        const formData = new FormData();

        formData.append('providerId', order.providerId.toString());
        formData.append('userId', userId);
        formData.append('status', order.status);
        formData.append('total', order.total);

        const deliveryDate = new Date(order.deliveryDate).toISOString().split('T')[0];
        formData.append('deliveryDate', deliveryDate);

        order.paymentMethodIds.forEach((id: number) => {
          console.log(id);
          formData.append('paymentMethodIds', id.toString());
        });

        if (FileUtility.isPhoto(order.invoice)) {
          const photo = order.invoice as Photo;
          const blob = FileUtility.dataUrlToBlob(photo.dataUrl!);

          formData.append('invoice', blob, 'imagenc.jpg');
        } else if (FileUtility.isFile(order.invoice)) {
          const file = order.invoice as File;

          formData.append('invoice', file);
        }

        if (order.paymentReceipt) {
          if (FileUtility.isPhoto(order.paymentReceipt)) {
            const photo = order.paymentReceipt as Photo;
            const blob = FileUtility.dataUrlToBlob(photo.dataUrl!);

            formData.append('paymentReceipt', blob, 'imagenc.jpg');
          } else if (FileUtility.isFile(order.paymentReceipt)) {
            const file = order.paymentReceipt as File;

            formData.append('paymentReceipt', file);
          }
        }

        return this.getFormOperation(formData);
      })
    ).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    });
  }

  private getFormOperation(formData: FormData): Observable<any> {
    return this.isOrderEdit
      ? this.orderService.editOrder(this.orderId, formData)
      : this.orderService.createOrder(formData);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['orders', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error);
    return of(null);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
