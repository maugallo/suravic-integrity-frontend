import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { EmployeeRequest } from '../../models/employee.model';
import { EmployeeMapper } from 'src/app/shared/mappers/employee.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { EmployeeService } from '../../services/employee.service';
import { ShiftService } from 'src/app/modules/shifts/services/shift.service';
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

@Component({
    selector: 'app-employee-form',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.scss'],
    imports: [IonContent, HeaderComponent, TextInputComponent, SelectInputComponent, NumberInputComponent, SubmitButtonComponent, FormsModule, IonSelectOption, WheelDateInputComponent],
standalone: true
})
export class EmployeeFormComponent {

  private employeeService = inject(EmployeeService);
  private shiftService = inject(ShiftService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  
  public dniMask = dniMask;
  public telephoneMask = telephoneMask;

  public shifts = this.shiftService.shifts;
  public employeeRole = EmployeeRole;

  public isEmployeeEdit!: boolean;
  public employeeId: number = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  public employee: Signal<EmployeeRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const employeeId = params.get('id');
      if (this.isParameterValid(employeeId)) {
        const employee = this.employeeService.getEmployeeById(Number(employeeId));
        if (!employee) this.router.navigate(['employees', 'dashboard']);
        this.isEmployeeEdit = true;
        this.employeeId = employee.id;
        return of(EmployeeMapper.toEmployeeRequest(employee));
      } else {
        this.isEmployeeEdit = false;
        return of(EntitiesUtility.getEmptyEmployeeRequest());
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
    return this.isEmployeeEdit
      ? this.employeeService.editEmployee(this.employeeId, this.employee()!)
      : this.employeeService.createEmployee(this.employee()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['employees', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
    return of(null);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
