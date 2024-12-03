import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { OperationType } from '../../models/operation-type.enum';
import { StorageType } from 'src/shared/models/storage-type.enum';
import { OperationRequest } from '../../models/operation.model';
import { OperationMapper } from 'src/shared/mappers/operation.mapper';
import { EntitiesUtility } from 'src/shared/utils/entities.utility';
import { FileUtility } from 'src/shared/utils/file.utility';
import { OperationService } from '../../services/operation.service';
import { AlertService } from 'src/shared/services/alert.service';
import { StorageService } from 'src/shared/services/storage.service';
import { ValidationService } from 'src/shared/services/validation.service';
import { NumberInputComponent } from 'src/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/shared/components/form/select-input/select-input.component';
import { TextInputComponent } from 'src/shared/components/form/text-input/text-input.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { FileInputComponent } from 'src/shared/components/form/file-input/file-input.component';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { Location, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-operation-form',
    templateUrl: './operation-form.component.html',
    styleUrls: ['./operation-form.component.scss'],
    imports: [IonContent, HeaderComponent, NumberInputComponent, SelectInputComponent, FileInputComponent, IonSelectOption, SubmitButtonComponent, FormsModule, TitleCasePipe],
standalone: true
})
export class OperationFormComponent {
  
  private operationService = inject(OperationService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  public isOperationEdit!: boolean;
  public operationId!: number;

  public operationType = OperationType;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  public operation: Signal<OperationRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const accountId = params.get('accountId');
      if (!accountId) {
        this.router.navigate(['operations', 'dashboard']);
        return EMPTY;
      }
      const operationId = params.get('id');
      if (this.isParameterValid(operationId)) {
        const operation = this.operationService.getOperationById(Number(operationId));
        if (!operation) {
          this.router.navigate(['operations', 'dashboard']);
          return EMPTY;
        }
        this.isOperationEdit = true;
        this.operationId = operation.id;
        const operationRequest = OperationMapper.toOperationRequest(operation);
        return this.operationService.getReceiptFile(this.operationId).pipe(
          tap(async (receipt) => (operationRequest.receipt = await FileUtility.getPhotoFromBlob(receipt))),
          map(() => operationRequest)
        );
      } else {
        this.isOperationEdit = false;
        const operationRequest = EntitiesUtility.getEmptyOperationRequest();
        operationRequest.creditAccountId = Number(accountId);
        return of(operationRequest);
      }
    })
  ));

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (!this.operation()!.receipt) {
      this.alertService.getErrorToast("Debes cargar una imagen o archivo").fire();
      return;
    }

    this.storageService.getStorage(StorageType.USER_ID).pipe(
      switchMap((userId) => {
        const operation = this.operation()!;
        const formData = new FormData();

        formData.append('creditAccountId', operation.creditAccountId.toString());
        formData.append('userId', userId);
        formData.append('total', operation.total.toString());
        formData.append('type', operation.type);

        const photo = operation.receipt as Photo;
        const blob = FileUtility.dataUrlToBlob(photo.dataUrl!);
        formData.append('receipt', blob, 'imagenc.jpg');

        return this.getFormOperation(formData);
      })
    ).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    });
  }

  private getFormOperation(formData: FormData): Observable<any> {
    return this.isOperationEdit
      ? this.operationService.editOperation(this.operationId, formData)
      : this.operationService.createOperation(formData);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['employees', 'dashboard']);
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
