import { Routes } from '@angular/router';

export const OPERATIONS_ROUTES: Routes = [
    { path: 'operations/dashboard/:employeeId', loadComponent: () => import('./operation-dashboard/operation-dashboard.component').then(m => m.OperationDashboardComponent) },
    { path: 'operations/detail/:id', loadComponent: () => import('./operation-detail/operation-detail.component').then(m => m.OperationDetailComponent) },
    { path: 'operations/form/:accountId', loadComponent: () => import('./operation-form/operation-form.component').then(m => m.OperationFormComponent) },
    { path: 'operations/form/:accountId/:id', loadComponent: () => import('./operation-form/operation-form.component').then(m => m.OperationFormComponent) }
]