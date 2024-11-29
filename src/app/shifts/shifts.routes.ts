import { Routes } from '@angular/router';

export const SHIFTS_ROUTES: Routes = [
    { path: 'shifts/dashboard', loadComponent: () => import('./shift-dashboard/shift-dashboard.component').then(m => m.ShiftDashboardComponent) },
    { path: 'shifts/form', loadComponent: () => import('./shift-form/shift-form.component').then(m => m.ShiftFormComponent) },
    { path: 'shifts/form/:id', loadComponent: () => import('./shift-form/shift-form.component').then(m => m.ShiftFormComponent) }
]