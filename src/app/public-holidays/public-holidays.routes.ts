import { Routes } from '@angular/router';

export const PUBLIC_HOLIDAYS_ROUTES: Routes = [
    { path: 'public-holidays/dashboard', loadComponent: () => import('./components/public-holiday-dashboard/public-holiday-dashboard.component').then(m => m.PublicHolidayDashboardComponent) },
    { path: 'public-holidays/form', loadComponent: () => import('./components/public-holiday-form/public-holiday-form.component').then(m => m.PublicHolidayFormComponent) },
    { path: 'public-holidays/form/:id', loadComponent: () => import('./components/public-holiday-form/public-holiday-form.component').then(m => m.PublicHolidayFormComponent) }
]