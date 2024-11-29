import { Routes } from '@angular/router';

export const LICENSES_ROUTES: Routes = [
    { path: 'licenses/dashboard', loadComponent: () => import('./license-dashboard/license-dashboard.component').then(m => m.LicenseDashboardComponent) },
    { path: 'licenses/form', loadComponent: () => import('./license-form/license-form.component').then(m => m.LicenseFormComponent) },
    { path: 'licenses/form/:id', loadComponent: () => import('./license-form/license-form.component').then(m => m.LicenseFormComponent) }
]