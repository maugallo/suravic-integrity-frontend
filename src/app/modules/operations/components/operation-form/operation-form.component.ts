import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { of, switchMap, tap } from 'rxjs';
import { OperationType } from '../../models/operation-type.enum';
import { StorageType } from 'src/app/shared/services/storage.service';
import { OperationMapper } from 'src/app/shared/mappers/operation.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { FileInputComponent } from 'src/app/shared/components/form/file-input/file-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { watchState } from '@ngrx/signals';
import { OperationStore } from '../../store/operation.store';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';

@Component({
  selector: 'app-operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss'],
  
  imports: [IonContent, HeaderComponent, NumberInputComponent, SelectInputComponent, FileInputComponent, IonSelectOption, SubmitButtonComponent, FormsModule, TitleCasePipe],
  standalone: true
})
export class OperationFormComponent {

  public validationService = inject(ValidationService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private operationStore = inject(OperationStore);
  private employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public operationType = OperationType;

  public operationId = 0;
  public oldTotal = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  constructor() {
    watchState(this.operationStore, () => {
      if (this.operationStore.success()) this.handleSuccess(this.operationStore.message());
      if (this.operationStore.error()) this.handleError(this.operationStore.message());
    });
  }

  public userId = toSignal(this.storageService.getStorage(StorageType.USER_ID));

  public idAccount = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('accountId')) || undefined))
  )); // Necesario que esté.

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined)),
    tap((id) => { if (id) this.operationStore.getReceiptFile(id) })
  )); // Opcional, si está significa que se va a editar una operation.

  public operation = computed(() => {
    if (this.idParam()) {
      const operation = this.operationStore.getEntityById(this.idParam()!);
      console.log(operation); 
      this.operationId = operation.id;

      const operationRequest = OperationMapper.toOperationRequest(operation);
      operationRequest.receipt = this.operationStore.receipt();
      this.oldTotal = operationRequest.total;

      return operationRequest;
    } else {
      const operationRequest = EntitiesUtility.getEmptyOperationRequest();
      operationRequest.creditAccountId = Number(this.idAccount());
      
      return operationRequest;
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (!this.operation().receipt) {
      this.alertService.getErrorToast("Debes cargar una imagen o archivo");
      return;
    }

    const formData = this.getFormData();
    if (this.idParam()) {
      this.operationStore.editEntity({ id: this.operationId, entity: formData })
    } else {
      this.operationStore.addEntity(formData);
    }

  }

  private getFormData(): FormData {
    const formData = new FormData();
    const operation = this.operation()!;

    formData.append('creditAccountId', operation.creditAccountId.toString());
    formData.append('userId', this.userId().toString());
    formData.append('total', operation.total.toString());
    formData.append('type', operation.type);

    this.appendFile(formData, 'receipt', operation.receipt!);

    return formData;
  }

  private appendFile(formData: FormData, fieldName: string, data: File | Photo) {
    const photo = data as Photo;
    const blob = FileUtility.dataUrlToBlob(photo.dataUrl!);
    formData.append(fieldName, blob, 'imagenc.jpg');
  }


  private handleSuccess(response: string) {
    if (response.includes('Creado'))
      console.log('Debería sumar: ' + this.operationStore.lastUpdatedEntity()?.total);
      this.employeeStore.addCreditAccountOperation(this.idAccount()!, this.operationStore.lastUpdatedEntity()!);
    if (response.includes('Modificado'))
      console.log('Debería modificar: ' + this.operationStore.lastUpdatedEntity()?.total);
      this.employeeStore.modifyCreditAccountOperation(this.idAccount()!, this.operationStore.lastUpdatedEntity()!, this.oldTotal);
    this.alertService.getSuccessToast(response);
    this.router.navigate(['operations', 'dashboard', this.idAccount()]);
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}
