import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseService } from '../../services/license.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonButton, IonList, IonSelectOption } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { LicenseItemComponent } from './license-item/license-item.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { EmployeeService } from 'src/app/modules/employees/services/employee.service';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';

@Component({
    selector: 'app-license-dashboard',
    templateUrl: './license-dashboard.component.html',
    styleUrls: ['./license-dashboard.component.scss'],
    imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, LicenseItemComponent, SelectInputComponent, IonSelectOption],
standalone: true
})
export class LicenseDashboardComponent {

  public router = inject(Router);

  private licenseService = inject(LicenseService);
  private employeeStore = inject(EmployeeStore);

  public licenses = this.licenseService.licenses;
  public employees = this.employeeStore.enabledEntities();

  public selectedEmployeeId = signal(-1);

  public filteredLicenses = computed(() => {
    if (this.selectedEmployeeId() !== -1) {
      return this.licenses().filter(license => license.employee.id === this.selectedEmployeeId());
    }
    return this.licenses();
  });

}
