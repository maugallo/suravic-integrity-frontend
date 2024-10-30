import { Routes } from '@angular/router';

export const EMPLOYEES_ROUTES: Routes = [
    { path: 'employees/dashboard', loadComponent: () => import('./employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent) },
    { path: 'employees/form', loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
    { path: 'employees/form/:id', loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
    { path: 'employees/detail/:id', loadComponent: () => import('./employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent) }
]