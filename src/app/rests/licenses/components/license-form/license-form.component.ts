import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { LicenseRequest } from '../../models/license.model';
import { LicenseMapper } from 'src/shared/mappers/license.mapper';
import { EntitiesUtility } from 'src/shared/utils/entities.utility';
import { LicenseService } from '../../services/license.service';
import { AlertService } from 'src/shared/services/alert.service';
import { ValidationService } from 'src/shared/services/validation.service';
import { NumberInputComponent } from 'src/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/shared/components/form/select-input/select-input.component';
import { TextInputComponent } from 'src/shared/components/form/text-input/text-input.component';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { TitleCasePipe } from '@angular/common';
import { WheelDateInputComponent } from 'src/shared/components/form/wheel-date-input/wheel-date-input.component';
import { LicenseType } from '../../models/license-type-enum';

@Component({
    selector: 'app-license-form',
    templateUrl: './license-form.component.html',
    styleUrls: ['./license-form.component.scss'],
    imports: [IonContent, HeaderComponent, SubmitButtonComponent, FormsModule, SelectInputComponent, IonSelectOption, TitleCasePipe, WheelDateInputComponent],
standalone: true
})
export class LicenseFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private licenseService = inject(LicenseService);
  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);

  public employees = this.employeeService.employees;
  public licenseType = LicenseType;

  public isLicenseEdit!: boolean;
  private licenseId!: number;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  public license: Signal<LicenseRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const licenseId = params!.get('id');
      if (this.isParameterValid(licenseId)) {
        const license = this.licenseService.getLicenseById(Number(licenseId));
        if (!license) this.router.navigate(['providers', 'dashboard']);
        this.isLicenseEdit = true;
        this.licenseId = license.id;
        return of(LicenseMapper.toLicenseRequest(license));
      } else {
        this.isLicenseEdit = false;
        return of(EntitiesUtility.getEmptyLicenseRequest());
      }
    })
  ));

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    this.getFormOperation().subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    });
  }

  private getFormOperation(): Observable<any> {
    return this.isLicenseEdit
      ? this.licenseService.editLicense(this.licenseId, this.license()!)
      : this.licenseService.createLicense(this.license()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['licenses', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
