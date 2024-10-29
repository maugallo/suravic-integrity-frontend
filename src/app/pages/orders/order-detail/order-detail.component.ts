import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import { OrderService } from 'src/app/core/services/order.service';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { FileUtility } from 'src/app/core/models/utils/file.utility';
import { Photo } from '@capacitor/camera';
import { CurrencyPipe } from '@angular/common';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { OrderStatus } from 'src/app/core/models/enums/order-status.enum';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, CurrencyPipe]
})
export class OrderDetailComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public fileUtility = FileUtility;

  private orderService = inject(OrderService);

  public orderStatus = OrderStatus;

  public invoice: File | Photo | undefined = undefined;
  public paymentReceipt: File | Photo | undefined = undefined;

  public order = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('id'))) {
        const order = this.orderService.getOrderById(Number(params.get('id')));
        if (!order) this.router.navigate(['orders', 'dashboard']);
        return this.orderService.getInvoiceFile(order.id).pipe(
          tap(async (invoice) => (invoice.type.startsWith('image/'))
            ? this.invoice = await FileUtility.getPhotoFromBlob(invoice)
            : this.invoice = FileUtility.getFileFromBlob(invoice, 'factura')),
          switchMap(() => {
            if (order.status === OrderStatus.PAGO) {
              return this.orderService.getPaymentReceiptFile(order.id).pipe(
                tap(async (paymentReceipt) => {
                  if (paymentReceipt && paymentReceipt.size > 0) {
                    (paymentReceipt.type.startsWith('image/'))
                      ? this.paymentReceipt = await FileUtility.getPhotoFromBlob(paymentReceipt)
                      : this.paymentReceipt = FileUtility.getFileFromBlob(paymentReceipt, 'comprobante')
                  }
                }),
                map(() => order)
              );
            }
            return of(order);
          })
        );
      }
      return of(null);
    })
  ));

  public async downloadFile() {
    if (this.invoice instanceof File) {
      try {
        // Guardar archivo en dispositivo.
        const base64Data = await FileUtility.fileToBase64(this.invoice);
        const savedFile = await Filesystem.writeFile({
          path: `Download/${this.invoice.name}`,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
        
        // Abrir archivo.
        const mimeType = FileUtility.getFileMimeType(this.invoice);
        const options: FileOpenerOptions = {
          filePath: savedFile.uri,
          contentType: mimeType,
          openWithDefault: true,
        };
        await FileOpener.open(options);
  
        console.log('Archivo descargado y abierto:', savedFile.uri);
      } catch (error) {
        console.error('Error al descargar y abrir el archivo:', error);
      }
    } else {
      console.error("No hay archivo para descargar.");
    }
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
