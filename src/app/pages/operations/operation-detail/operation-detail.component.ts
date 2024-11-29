import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { map, of, switchMap, tap } from 'rxjs';
import { FileUtility } from 'src/app/core/models/utils/file.utility';
import { OperationService } from 'src/app/core/services/operation.service';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { StorageType } from 'src/app/core/models/enums/storage-type.enum';
import { TokenUtility } from 'src/app/core/models/utils/token.utility';

@Component({
    selector: 'app-operation-detail',
    templateUrl: './operation-detail.component.html',
    styleUrls: ['./operation-detail.component.scss'],
    imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, CurrencyPipe, TitleCasePipe],
    standalone: true
})
export class OperationDetailComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  public fileUtility = FileUtility;

  private operationService = inject(OperationService);
  private storageService = inject(StorageService);

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
