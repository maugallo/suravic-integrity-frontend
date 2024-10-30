import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeResponse } from 'src/app/core/models/interfaces/employee.model';
import { Filter } from 'src/app/core/models/interfaces/filter.model';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, MenuController, IonToggle } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { DeletedButtonComponent } from "../../../shared/components/deleted-button/deleted-button.component";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { EmployeeItemComponent } from "./employee-item/employee-item.component";

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
  standalone: true,
  imports: [IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, IonToggle, HeaderComponent, DeletedButtonComponent, NotFoundComponent, EmployeeItemComponent]
})
export class EmployeeDashboardComponent {

  public router = inject(Router);
  private menuController = inject(MenuController);

  private employeeService = inject(EmployeeService);

  private employees = this.employeeService.employees;
  private searchQuery = signal<string>('');
  private filters = signal<Filter[]>([]);

  public filteredEmployees = computed(() => {
    const employees = this.filterEmployees(this.employees(), this.filters(), this.seeDeleted());

    return employees.filter(employee =>
      employee.firstName.toLowerCase().includes(this.searchQuery()) ||
      employee.lastName.toLowerCase().includes(this.searchQuery()));
  });

  public seeDeleted = signal(false);

  public searchForEmployees(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public openFilterMenu() {
    this.menuController.open("filter-menu");
  }

  public receiveFilters(filters: any) {
    this.filters.set([...filters]);
    /* IMPORTANTE: Angular compara la referencia del array y,
    al no cambiar la referencia del array en sí
    (solo sus elementos internos), no dispara la reactividad.
    Por eso tenemos que asignar un array completamente nuevo,
    pisando el anterior. */
  }

  private filterEmployees(employees: EmployeeResponse[], filters: Filter[], seeDeleted: boolean) {
    let filteredEmployees = employees.filter(employee => employee.isEnabled !== seeDeleted);

    /* if (filters.length > 0) {
      const sectorsFilter = filters[0].value;
      const vatConditionsFilter = filters[1].value;
  
      filteredEmployees = filteredEmployees.filter(employee =>
        (sectorsFilter.length === 0 || sectorsFilter.includes(employee.sector.id)) &&
        (vatConditionsFilter.length === 0 || vatConditionsFilter.includes(employee.vatCondition))
      );
    } */

    return filteredEmployees;
  }

}
