import { Routes } from '@angular/router';

export const DAYS_OFF_ROUTES: Routes = [
    { path: 'days-off/dashboard', loadComponent: () => import('./day-off-dashboard/day-off-dashboard.component').then(m => m.DayOffDashboardComponent) },
    { path: 'days-off/form', loadComponent: () => import('./day-off-form/day-off-form.component').then(m => m.DayOffFormComponent) },
    /* { path: 'days-off/detail/:id', loadComponent: () => import('./day-off-detail/day-off-detail.component').then(m => m.DayOffDetailComponent) }, */
    /* { path: 'days-off/form/:id', loadComponent: () => import('./day-off-form/day-off-form.component').then(m => m.DayOffFormComponent) } */
]