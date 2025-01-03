import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { Photo } from '@capacitor/camera';
import { WheelDateInputComponent } from 'src/app/shared/components/form/wheel-date-input/wheel-date-input.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { OrderMapper } from 'src/app/shared/mappers/order.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { FileInputComponent } from 'src/app/shared/components/form/file-input/file-input.component';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { OrderStatus } from '../../models/order-status.enum';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';
import { OrderStore } from '../../stores/order.store';
import { PaymentMethodStore } from '../../stores/payment-method.store';
import { watchState } from '@ngrx/signals';
import { StorageService, StorageType } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, WheelDateInputComponent, NumberInputComponent, SelectInputComponent, SubmitButtonComponent, FileInputComponent],
  standalone: true
})
export class OrderFormComponent {

  private alertService = inject(AlertService);
  private storageService = inject(StorageService);
  public validationService = inject(ValidationService);
  private orderStore = inject(OrderStore);
  private paymentMethodStore = inject(PaymentMethodStore);
  private providerStore = inject(ProviderStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public today = new Date().toISOString().split('T')[0];

  public providers = this.providerStore.enabledEntities();
  public paymentMethods = this.paymentMethodStore.entities();
  public orderStatus = OrderStatus;

  public orderId = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent | WheelDateInputComponent>;

  constructor() {
    watchState(this.orderStore, () => {
      if (this.orderStore.success()) this.handleSuccess(this.orderStore.message());
      if (this.orderStore.error()) this.handleError(this.orderStore.message());
    });
  }

  public userId = toSignal(this.storageService.getStorage(StorageType.USER_ID));

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined)),
    tap((id) => { if (id) this.orderStore.getInvoiceFile(id) }),
    tap((id) => { if (id) this.orderStore.getPaymentReceiptFile(id) })
  ));

  public order = computed(() => {
    if (this.idParam()) {
      const order = this.orderStore.getEntityById(this.idParam()!);
      this.orderId = order!.id!;

      const orderRequest = OrderMapper.toOrderRequest(order!);
      orderRequest.invoice = this.orderStore.invoice();
      orderRequest.paymentReceipt = this.orderStore.paymentReceipt();

      return orderRequest;
    } else {
      return EntitiesUtility.getEmptyOrderRequest();
    }
  });

  public onProviderChange(selectedProviderId: any) {
    this.order().providerId = selectedProviderId;
  }

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (!this.order().invoice) {
      this.alertService.getErrorToast("Debes cargar una imagen o archivo para la factura de pedido");
      return;
    }

    const formData = this.getFormData();
    if (this.idParam()) {
      this.orderStore.editEntity({ id: this.orderId, entity: formData })
    } else {
      this.orderStore.addEntity(formData);
    }

  }

  private getFormData(): FormData {
    const formData = new FormData();
    const order = this.order();

    formData.append('providerId', order.providerId.toString());
    formData.append('userId', this.userId().toString());
    formData.append('status', order.status);
    formData.append('total', order.total);

    const deliveryDate = new Date(order.deliveryDate).toISOString().split('T')[0];
    formData.append('deliveryDate', deliveryDate);

    order.paymentMethodIds.forEach((id: number) =>
      formData.append('paymentMethodIds', id.toString()));

    this.appendFile(formData, 'invoice', order.invoice!);

    if (order.paymentReceipt) {
      this.appendFile(formData, 'paymentReceipt', order.paymentReceipt);
    }

    return formData;
  }

  private appendFile(formData: FormData, fieldName: string, data: File | Photo) {
    if (FileUtility.isPhoto(data)) {
      const photo = data as Photo;
      const blob = FileUtility.dataUrlToBlob(photo.dataUrl!);
      formData.append(fieldName, blob, 'attachment.jpg');
    }
    if (FileUtility.isFile(data)) {
      const file = data as File;
      formData.append(fieldName, file, file.name);
    }
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['orders', 'dashboard']);
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}
