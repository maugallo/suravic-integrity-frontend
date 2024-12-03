import { Routes } from "@angular/router";

export const USERS_ROUTES: Routes = [
    { path: 'users/dashboard', loadComponent: () => import('./components/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent) },
    { path: 'users/form', loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent) },
    { path: 'users/form/:id', loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent) }
]