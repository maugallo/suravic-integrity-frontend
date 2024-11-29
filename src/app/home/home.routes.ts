import { Routes } from "@angular/router";

export const HOME_ROUTES: Routes = [
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent) }
]