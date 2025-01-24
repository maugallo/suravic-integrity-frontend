import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { EmployeeMapper } from 'src/app/shared/mappers/employee.mapper';
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
import { dniMask } from 'src/app/shared/masks/dni.mask';
import { telephoneMask } from 'src/app/shared/masks/telephone.mask';
import { WheelDateInputComponent } from 'src/app/shared/components/form/wheel-date-input/wheel-date-input.component';
import { EmployeeRole } from '../../models/employee-role.enum';
import { EmployeeStore } from '../../stores/employee.store';
import { watchState } from '@ngrx/signals';
import { ShiftStore } from 'src/app/modules/shifts/store/shift.store';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  imports: [IonContent, HeaderComponent, TextInputComponent, SelectInputComponent, NumberInputComponent, SubmitButtonComponent, FormsModule, IonSelectOption, WheelDateInputComponent],
  standalone: true
})
export class EmployeeFormComponent {

  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private shiftStore = inject(ShiftStore);
  private employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public shifts = computed(() => this.shiftStore.enabledEntities());
  public employeeRoles = EmployeeRole;

  public employeeId = 0;

  public readonly dniMask = dniMask;
  public readonly telephoneMask = telephoneMask;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  constructor() {
    watchState(this.employeeStore, () => {
      if (this.employeeStore.success()) this.handleSuccess(this.employeeStore.message());
      if (this.employeeStore.error()) this.handleError(this.employeeStore.message());
    });
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined))
  ));

  public employee = computed(() => {
    if (this.idParam()) {
      const employee = this.employeeStore.getEntityById(this.idParam()!);
      this.employeeId = employee.id;

      return EmployeeMapper.toEmployeeRequest(employee);
    } else {
      return EntitiesUtility.getEmptyEmployeeRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.idParam()) {
      this.employeeStore.editEntity({ id: this.employeeId, entity: this.employee() });
    } else {
      this.employeeStore.addEntity(this.employee());
    }
  }

  private handleSuccess(message: string) {
    this.alertService.getSuccessToast(message);
    this.router.navigate(['employees', 'dashboard']);
  }

  private handleError(error: any) {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
  }

}
