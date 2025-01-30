import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSearchbar, IonButton, IonList } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { DeletedButtonComponent } from 'src/app/shared/components/deleted-button/deleted-button.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { EmployeeItemComponent } from "./employee-item/employee-item.component";
import { EmployeeStore } from '../../stores/employee.store';
import { watchState } from '@ngrx/signals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { LicenseStore } from 'src/app/modules/rests/licenses/store/licenses.store';
import { DayOffStore } from 'src/app/modules/rests/days-off/store/days-off.store';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  imports: [IonContent, IonSearchbar, IonButton, IonList, HeaderComponent, DeletedButtonComponent, NotFoundComponent, EmployeeItemComponent],
  standalone: true
})
export class EmployeeDashboardComponent {

  private alertService = inject(AlertService);
  private employeeStore = inject(EmployeeStore);
  private licenseStore = inject(LicenseStore);
  private dayOffStore = inject(DayOffStore);
  public router = inject(Router);

  public seeDeleted = signal(false);
  private searchQuery = signal('');

  public employees = computed(() => {
    const employees = this.seeDeleted() ? this.employeeStore.deletedEntities() : this.employeeStore.enabledEntities();

    return employees.filter(employee => (employee.firstName || employee.lastName).toLowerCase().includes(this.searchQuery()));
  });

  constructor() {
    watchState(this.employeeStore, () => {
      if (this.employeeStore.success()) this.handleSuccess(this.employeeStore.message());
      if (this.employeeStore.error()) this.alertService.getErrorAlert(this.employeeStore.message());
    });
  }

  public searchForEmployees(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  private handleSuccess(message: string) {
    if (message.includes('Eliminado') || message.includes('Recuperado')) {
      this.licenseStore.updateEntitiesByEmployee(this.employeeStore.lastUpdatedEntity()!);
    }
    this.alertService.getSuccessToast(this.employeeStore.message());
  }

}
