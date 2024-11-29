import { Routes } from '@angular/router';

export const SHIFTS_ROUTES: Routes = [
    { path: 'shifts/dashboard', loadComponent: () => import('./components/shift-dashboard/shift-dashboard.component').then(m => m.ShiftDashboardComponent) },
    { path: 'shifts/form', loadComponent: () => import('./components/shift-form/shift-form.component').then(m => m.ShiftFormComponent) },
    { path: 'shifts/form/:id', loadComponent: () => import('./components/shift-form/shift-form.component').then(m => m.ShiftFormComponent) }
]