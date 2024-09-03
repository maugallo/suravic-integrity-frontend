import { Routes } from "@angular/router";

export const USERS_ROUTES: Routes = [
    { path: 'users/dashboard', loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent) },
    { path: 'users/form', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) }
]