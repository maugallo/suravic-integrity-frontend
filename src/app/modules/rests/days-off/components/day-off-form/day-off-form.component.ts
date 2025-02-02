import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { IonContent, IonSelectOption, IonDatetime } from "@ionic/angular/standalone";
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Router } from '@angular/router';
import { ShiftResponse } from 'src/app/modules/shifts/models/shift.model';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';
import { ShiftStore } from 'src/app/modules/shifts/store/shift.store';
import { DayOffStore } from '../../store/days-off.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-day-off-form',
  templateUrl: './day-off-form.component.html',
  styleUrls: ['./day-off-form.component.scss'],
  imports: [IonDatetime, IonContent, SelectInputComponent, SubmitButtonComponent, FormsModule, IonSelectOption, HeaderComponent],
  standalone: true
})
export class DayOffFormComponent {

  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private dayOffStore = inject(DayOffStore);
  private employeeStore = inject(EmployeeStore);
  private shiftStore = inject(ShiftStore);
  private router = inject(Router);

  public employees = computed(() => this.employeeStore.enabledEntities());
  private shifts = computed(() => this.shiftStore.enabledEntities());
  private daysOff = computed(() => this.dayOffStore.enabledEntities());

  public employeeShifts: ShiftResponse[] = [];

  public dayOff = EntitiesUtility.getEmptyDayOffRequest();

  @ViewChildren('formInput') inputComponents!: QueryList<SelectInputComponent>;

  constructor() {
    watchState(this.dayOffStore, () => {
      if (this.dayOffStore.success()) this.handleSuccess("Asignado correctamente!");
      if (this.dayOffStore.error()) this.handleError(this.dayOffStore.message());
    });
  }

  public takenDates = computed(() => {
    if (this.daysOff()) {
      return this.daysOff().map(dayOff => { return { date: dayOff.day, textColor: '#fff', backgroundColor: '#eb8b47' } });
    }
    return [];
  });

  public changeEmployeeShifts() {
    const employee = this.employeeStore.getEntityById(this.dayOff.employeeId);
    const employeeShiftsIds = employee.shifts.map(shift => shift.id);
    this.employeeShifts = this.shifts().filter(shift => employeeShiftsIds.includes(shift.id));
  }

  public minDate: string = this.getToday(new Date());
  public maxDate: string = this.getEndOfThreeWeeks(new Date());

  private getToday(date: Date): string {
    return date.toISOString().split('T')[0];
  }  

  private getEndOfThreeWeeks(date: Date): string {
    const day = date.getDay();
    const diff = date.getDate() + (21 - day) - (day === 0 ? 7 : 1);
    const endOfThreeWeeks = new Date(date.setDate(diff));
    return endOfThreeWeeks.toISOString().split('T')[0];
  }

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    this.dayOffStore.addEntity(this.dayOff);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['days-off', 'dashboard']);
  }

  private handleError(error: any) {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
  }

}
