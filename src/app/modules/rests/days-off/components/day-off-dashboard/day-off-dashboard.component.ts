import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonButton, IonList, IonSelectOption } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { DayOffItemComponent } from "./day-off-item/day-off-item.component";
import { DayOffStore } from '../../store/days-off.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';
import { SelectInputComponent } from "../../../../../shared/components/form/select-input/select-input.component";
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';

@Component({
  selector: 'app-day-off-dashboard',
  templateUrl: './day-off-dashboard.component.html',
  styleUrls: ['./day-off-dashboard.component.scss'],
  imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, DayOffItemComponent, SelectInputComponent, IonSelectOption],
  standalone: true
})
export class DayOffDashboardComponent {

  private alertService = inject(AlertService);
  private dayOffStore = inject(DayOffStore);
  private employeeStore = inject(EmployeeStore);
  public router = inject(Router);

  public employees = computed(() => this.employeeStore.enabledEntities());

  public selectedEmployeeId = signal(-1);

  public daysOff = computed(() => {
    if (this.selectedEmployeeId() !== -1) {
      return this.dayOffStore.enabledEntities().filter(dayOff => dayOff.employee.id === this.selectedEmployeeId());
    }
    return this.dayOffStore.enabledEntities();
  });

  constructor() {
    watchState(this.dayOffStore, () => {
      if (this.dayOffStore.success()) this.alertService.getSuccessToast(this.dayOffStore.message());
      if (this.dayOffStore.error()) this.alertService.getErrorAlert(this.dayOffStore.message());
    });
  }

}
