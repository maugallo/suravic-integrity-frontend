import { Routes } from '@angular/router';

export const LICENSES_ROUTES: Routes = [
    { path: 'licenses/dashboard', loadComponent: () => import('./components/license-dashboard/license-dashboard.component').then(m => m.LicenseDashboardComponent) },
    { path: 'licenses/form', loadComponent: () => import('./components/license-form/license-form.component').then(m => m.LicenseFormComponent) },
    { path: 'licenses/form/:id', loadComponent: () => import('./components/license-form/license-form.component').then(m => m.LicenseFormComponent) }
]