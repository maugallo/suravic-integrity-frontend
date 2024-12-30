import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { OrderStatus } from '../../models/order-status.enum';
import { OrderStore } from '../../stores/order.store';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, CurrencyPipe, DatePipe],
standalone: true
})
export class OrderDetailComponent {

  private orderStore = inject(OrderStore);
  private activatedRoute = inject(ActivatedRoute);

  public fileUtility = FileUtility;
  public orderStatus = OrderStatus;

  public invoice = computed(() => this.orderStore.invoice());
  public paymentReceipt = computed(() => this.orderStore.paymentReceipt());

  public order = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')))),
    tap((id) => this.orderStore.getInvoiceFile(id) ),
    tap((id) => this.orderStore.getPaymentReceiptFile(id) ),
    switchMap((orderId) => of(this.orderStore.getEntityById(orderId)))
  ));

  public async downloadFile() {
    if (this.invoice instanceof File) {
      try {
        const base64Data = await FileUtility.blobToBase64(this.invoice);
        const savedFile = await Filesystem.writeFile({
          path: `Download/${this.invoice.name}`,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });

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

}
