import { Component, computed, inject, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeResponse } from 'src/app/core/models/interfaces/employee.model';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { IonContent, IonSearchbar, IonButton, IonList } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { DeletedButtonComponent } from "../../../shared/components/deleted-button/deleted-button.component";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { EmployeeItemComponent } from "./employee-item/employee-item.component";

@Component({
    selector: 'app-employee-dashboard',
    templateUrl: './employee-dashboard.component.html',
    styleUrls: ['./employee-dashboard.component.scss'],
    imports: [IonContent, IonSearchbar, IonButton, IonList, HeaderComponent, DeletedButtonComponent, NotFoundComponent, EmployeeItemComponent]
})
export class EmployeeDashboardComponent {

  public router = inject(Router);

  private employeeService = inject(EmployeeService);

  private employees = this.employeeService.employees;
  private searchQuery = signal<string>('');

  public seeDeleted = signal(false);

  public searchBarResult: Signal<EmployeeResponse[]> = computed(() => this.employees().filter(employee => (employee.firstName || employee.lastName).toLowerCase().indexOf(this.searchQuery()) > -1 && employee.isEnabled !== this.seeDeleted()));

  public searchForEmployees(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
