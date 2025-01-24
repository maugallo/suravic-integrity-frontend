import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StorageType } from 'src/app/shared/services/storage.service';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { OperationStore } from '../../store/operation.store';

@Component({
  selector: 'app-operation-detail',
  templateUrl: './operation-detail.component.html',
  styleUrls: ['./operation-detail.component.scss'],
  
  imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, CurrencyPipe, TitleCasePipe],
  standalone: true
})
export class OperationDetailComponent {

  private operationStore = inject(OperationStore);
  private storageService = inject(StorageService);
  private activatedRoute = inject(ActivatedRoute);

  public fileUtility = FileUtility;

  public currentUserRole = toSignal(this.storageService.getStorage(StorageType.USER_ID));
  public receipt = computed(() => this.operationStore.receipt());

  public operation = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')))),
    tap((id) => this.operationStore.getReceiptFile(id)),
    switchMap((orderId) => of(this.operationStore.getEntityById(orderId)))
  ));

}
