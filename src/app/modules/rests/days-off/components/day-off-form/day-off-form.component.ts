import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { DayOffService } from '../../services/day-off.service';
import { IonContent, IonSelectOption, IonDatetime } from "@ionic/angular/standalone";
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { ShiftService } from 'src/app/modules/shifts/services/shift.service';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ShiftResponse } from 'src/app/modules/shifts/models/shift.model';

@Component({
    selector: 'app-day-off-form',
    templateUrl: './day-off-form.component.html',
    styleUrls: ['./day-off-form.component.scss'],
    imports: [IonDatetime, IonContent, SelectInputComponent, SubmitButtonComponent, FormsModule, IonSelectOption, HeaderComponent],
standalone: true
})
export class DayOffFormComponent {

  private router = inject(Router);

  private dayOffService = inject(DayOffService);
  private employeeService = inject(EmployeeService);
  private shiftService = inject(ShiftService);
  private validationService = inject(ValidationService);
  private alertService = inject(AlertService);

  public daysOff = this.dayOffService.daysOff;
  public employees = this.employeeService.employees;
  public shifts = this.shiftService.shifts;

  public employeeShifts: ShiftResponse[] = [];

  @ViewChildren('formInput') inputComponents!: QueryList<SelectInputComponent>;

  public dayOff = EntitiesUtility.getEmptyDayOffRequest();

  public takenDates = computed(() => {
    if (this.daysOff()) {
      return this.daysOff().map(dayOff => { return { date: dayOff.day, textColor: '#fff', backgroundColor: '#eb8b47' } });
    }
    return [];
  });

  public changeEmployeeShifts() {
    const employee = this.employeeService.getEmployeeById(this.dayOff.employeeId);
    const employeeShiftsIds = employee.shifts.map(shift => shift.id);
    this.employeeShifts = this.shifts().filter(shift => employeeShiftsIds.includes(shift.id));
  }

  public minDate: string = this.getStartOfWeek(new Date());
  public maxDate: string = this.getEndOfThreeWeeks(new Date());

  private getStartOfWeek(date: Date): string {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    return startOfWeek.toISOString().split('T')[0];
  }

  private getEndOfThreeWeeks(date: Date): string {
    const day = date.getDay();
    const diff = date.getDate() + (21 - day) - (day === 0 ? 7 : 1);
    const endOfThreeWeeks = new Date(date.setDate(diff));
    return endOfThreeWeeks.toISOString().split('T')[0];
  }

  public onSubmit() {
    console.log("Se quiere enviar al back");
    console.log(this.dayOff);

    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    this.dayOffService.createDayOff(this.dayOff).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    })
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['days-off', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
    return of(null);
  }

}
