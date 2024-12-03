import { Routes } from '@angular/router';

export const DAYS_OFF_ROUTES: Routes = [
    { path: 'days-off/dashboard', loadComponent: () => import('./components/day-off-dashboard/day-off-dashboard.component').then(m => m.DayOffDashboardComponent) },
    { path: 'days-off/form', loadComponent: () => import('./components/day-off-form/day-off-form.component').then(m => m.DayOffFormComponent) }
]