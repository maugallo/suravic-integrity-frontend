import { Routes } from '@angular/router';

export const OPERATIONS_ROUTES: Routes = [
    { path: 'operations/dashboard/:employeeId', loadComponent: () => import('./components/operation-dashboard/operation-dashboard.component').then(m => m.OperationDashboardComponent) },
    { path: 'operations/detail/:id', loadComponent: () => import('./components/operation-detail/operation-detail.component').then(m => m.OperationDetailComponent) },
    { path: 'operations/form/:accountId', loadComponent: () => import('./components/operation-form/operation-form.component').then(m => m.OperationFormComponent) },
    { path: 'operations/form/:accountId/:id', loadComponent: () => import('./components/operation-form/operation-form.component').then(m => m.OperationFormComponent) }
]