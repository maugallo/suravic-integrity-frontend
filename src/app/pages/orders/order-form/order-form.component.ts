import { Component, DestroyRef, inject, Signal, ViewChild } from '@angular/core';
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
import { IonContent, IonButton, IonSelectOption } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { WheelDateInputComponent } from "../../../shared/components/form/wheel-date-input/wheel-date-input.component";
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";
import { SelectInputComponent } from "../../../shared/components/form/select-input/select-input.component";
import { ORDER_STATUS, PAYMENT_METHODS } from './order-selects.constant';
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent, HeaderComponent, FormsModule, IonSelectOption, WheelDateInputComponent, NumberInputComponent, SelectInputComponent, SubmitButtonComponent]
})
export class OrderFormComponent {

  public testDate = new Date();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public validationService = inject(ValidationService);
  private orderService = inject(OrderService);
  private providerService = inject(ProviderService);
  private sessionService = inject(SessionService);
  private alertService = inject(AlertService);

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.
  public today = new Date().toISOString().split('T')[0];

  public isOrderEdit!: boolean;
  public orderId!: number;

  public providers = this.providerService.providers;
  public orderStatus = ORDER_STATUS;
  public paymentMethods = PAYMENT_METHODS;

  @ViewChild('fileInput') fileInput: any;
  private actionSheetCtrl = inject(ActionSheetController);

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
        console.log(new File([], ''))
        return of({
          providerId: 0,
          userId: 0,
          status: '',
          paymentMethod: [],
          deliveryDate: new Date().toISOString(),
          total: '',
          invoice: undefined,
          paymentReceipt: undefined
        });
      }
    })
  ));

  public onProviderChange(selectedProviderId: any) {
    this.order()!.providerId = selectedProviderId;
  }

  public onSubmit(orderForm: NgForm) {
    console.log(this.order()!.deliveryDate);

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

  public async selectImageSource() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar una imagen',
      buttons: [
        {
          text: 'Elegir de la galería',
          handler: () => {
            this.openCameraOrGallery(CameraSource.Photos);
          },
        },
        {
          text: 'Tomar una foto',
          handler: () => {
            this.openCameraOrGallery(CameraSource.Camera);
          },
        }
      ],
    });
    await actionSheet.present();
  }

  public async openCameraOrGallery(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
      });

      console.log('Imagen seleccionada:', image);
      this.order()!.invoice = image;
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
    }
  }

  public triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('Archivo seleccionado:', file);
      // Puedes hacer algo con el archivo, como enviarlo al backend.
    }
  }

  public isPhoto(file: any): Photo | null {
    return 'dataUrl' in file ? file as Photo : null;
  }

  public isFile(file: any): File | null {
    return file instanceof File ? file as File : null;
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

  public isSelectNotValid(select: NgModel, selectedValue: string | number) {
    return (select && select.touched && (!selectedValue || selectedValue === 0));
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
