import { Routes } from '@angular/router';

export const PUBLIC_HOLIDAYS_ROUTES: Routes = [
    { path: 'public-holidays/dashboard', loadComponent: () => import('./public-holiday-dashboard/public-holiday-dashboard.component').then(m => m.PublicHolidayDashboardComponent) },
    { path: 'public-holidays/form', loadComponent: () => import('./public-holiday-form/public-holiday-form.component').then(m => m.PublicHolidayFormComponent) },
    { path: 'public-holidays/form/:id', loadComponent: () => import('./public-holiday-form/public-holiday-form.component').then(m => m.PublicHolidayFormComponent) }
    /* { path: 'public-holidays/detail/:id', loadComponent: () => import('./public-holiday-detail/public-holiday-detail.component').then(m => m.PublicHolidayDetailComponent) }, */
]