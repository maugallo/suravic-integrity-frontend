import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [
    /* { path: 'accounts/dashboard', loadComponent: () => import('./account-dashboard/account-dashboard.component').then(m => m.AccountDashboardComponent) }, */
    { path: 'accounts/detail/:id', loadComponent: () => import('./account-detail/account-detail.component').then(m => m.AccountDetailComponent) },
    { path: 'accounts/form', loadComponent: () => import('./operation-form/operation-form.component').then(m => m.OperationFormComponent) },
    { path: 'accounts/form/:id', loadComponent: () => import('./operation-form/operation-form.component').then(m => m.OperationFormComponent) }
]