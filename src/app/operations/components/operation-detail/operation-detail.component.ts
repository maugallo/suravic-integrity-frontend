import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { map, of, switchMap, tap } from 'rxjs';
import { OperationService } from '../../services/operation.service';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/shared/components/back-button/back-button.component';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { StorageService } from 'src/shared/services/storage.service';
import { StorageType } from 'src/shared/models/storage-type.enum';
import { FileUtility } from 'src/shared/utils/file.utility';
import { TokenUtility } from 'src/shared/utils/token.utility';

@Component({
  selector: 'app-operation-detail',
  templateUrl: './operation-detail.component.html',
  styleUrls: ['./operation-detail.component.scss'],
  imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, CurrencyPipe, TitleCasePipe]
})
export class OperationDetailComponent {

  private operationService = inject(OperationService);
  private storageService = inject(StorageService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public fileUtility = FileUtility;

  public receipt: Photo | undefined = undefined;

  public currentUserRole = toSignal(this.storageService.getStorage(StorageType.TOKEN).pipe(
    map((token) => TokenUtility.getRoleFromToken(token))
  ));

  public operation = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('id'))) {
        const operation = this.operationService.getOperationById(Number(params.get('id')));
        if (!operation) this.router.navigate(['employees', 'dashboard']);
        return this.operationService.getReceiptFile(operation.id).pipe(
          tap(async (receipt) => (this.receipt = await FileUtility.getPhotoFromBlob(receipt))),
          map(() => operation)
        );
      }
      return of(null);
    })
  ));

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
