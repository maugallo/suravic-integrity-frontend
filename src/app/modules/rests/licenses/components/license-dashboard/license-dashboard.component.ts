import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonButton, IonList, IonSelectOption } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { LicenseItemComponent } from './license-item/license-item.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';
import { LicenseStore } from '../../store/licenses.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-license-dashboard',
  templateUrl: './license-dashboard.component.html',
  styleUrls: ['./license-dashboard.component.scss'],
  imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, LicenseItemComponent, SelectInputComponent, IonSelectOption],
  standalone: true
})
export class LicenseDashboardComponent {

  private alertService = inject(AlertService);
  private licenseStore = inject(LicenseStore);
  private employeeStore = inject(EmployeeStore);
  public router = inject(Router);

  public employees = computed(() => this.employeeStore.enabledEntities());

  public selectedEmployeeId = signal(-1);

  public licenses = computed(() => {
    if (this.selectedEmployeeId() !== -1) {
      return this.licenseStore.enabledEntities().filter(license => license.employee.id === this.selectedEmployeeId());
    }
    return this.licenseStore.enabledEntities();
  });

  constructor() {
    watchState(this.licenseStore, () => {
      if (this.licenseStore.success()) this.alertService.getSuccessToast(this.licenseStore.message());
      if (this.licenseStore.error()) this.alertService.getErrorAlert(this.licenseStore.message());
    });
  }

}
