import { Routes } from '@angular/router';

export const PROVIDERS_ROUTES: Routes = [
    { path: 'providers/dashboard', loadComponent: () => import('./components/provider-dashboard/provider-dashboard.component').then(m => m.ProviderDashboardComponent) },
    { path: 'providers/detail/:id', loadComponent: () => import('./components/provider-detail/provider-detail.component').then(m => m.ProviderDetailComponent) },
    { path: 'providers/form', loadComponent: () => import('./components/provider-form/provider-form.component').then(m => m.ProviderFormComponent) },
    { path: 'providers/form/:id', loadComponent: () => import('./components/provider-form/provider-form.component').then(m => m.ProviderFormComponent) }
]