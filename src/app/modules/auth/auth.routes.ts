import { Routes } from "@angular/router";

export const AUTH_ROUTES: Routes = [
    { path: 'welcome', loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'forgot-password', loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) }
];