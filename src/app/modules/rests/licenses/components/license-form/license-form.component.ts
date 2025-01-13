import { Component, computed, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { LicenseMapper } from 'src/app/shared/mappers/license.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { WheelDateInputComponent } from 'src/app/shared/components/form/wheel-date-input/wheel-date-input.component';
import { LicenseType } from '../../models/license-type-enum';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';
import { LicenseStore } from '../../store/licenses.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-license-form',
  templateUrl: './license-form.component.html',
  styleUrls: ['./license-form.component.scss'],
  imports: [IonContent, HeaderComponent, SubmitButtonComponent, FormsModule, SelectInputComponent, IonSelectOption, TitleCasePipe, WheelDateInputComponent],
  standalone: true
})
export class LicenseFormComponent {

  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private licenseStore = inject(LicenseStore);
  private employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public employees = computed(() => this.employeeStore.enabledEntities());
  public licenseType = LicenseType;

  public licenseId = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  constructor() {
    watchState(this.licenseStore, () => {
      if (this.licenseStore.success()) this.handleSuccess(this.licenseStore.message());
      if (this.licenseStore.error()) this.handleError(this.licenseStore.message());
    });
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined))
  ));

  public license = computed(() => {
    if (this.idParam()) {
      const license = this.licenseStore.getEntityById(this.idParam()!);
      this.licenseId = license.id!;

      return LicenseMapper.toLicenseRequest(license);
    } else {
      return EntitiesUtility.getEmptyLicenseRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.idParam()) {
      this.licenseStore.editEntity({ id: this.licenseId, entity: this.license() });
    } else {
      this.licenseStore.addEntity(this.license());
    }
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['licenses', 'dashboard']);
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}
