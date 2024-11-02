import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseService } from 'src/app/core/services/license.service';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { IonContent, IonButton, IonList, IonSelectOption } from "@ionic/angular/standalone";
import { NotFoundComponent } from "../../../../shared/components/not-found/not-found.component";
import { LicenseItemComponent } from "./license-item/license-item.component";
import { SelectInputComponent } from "../../../../shared/components/form/select-input/select-input.component";
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-license-dashboard',
  templateUrl: './license-dashboard.component.html',
  styleUrls: ['./license-dashboard.component.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, LicenseItemComponent, SelectInputComponent, IonSelectOption]
})
export class LicenseDashboardComponent {

  public router = inject(Router);

  private licenseService = inject(LicenseService);
  private employeeService = inject(EmployeeService);

  public licenses = this.licenseService.licenses;
  public employees = this.employeeService.employees;

  public selectedEmployeeId = signal(-1);

  public filteredLicenses = computed(() => {
    if (this.selectedEmployeeId() !== -1) {
      return this.licenses().filter(license => license.employee.id === this.selectedEmployeeId());
    }
    return this.licenses();
  });

}
