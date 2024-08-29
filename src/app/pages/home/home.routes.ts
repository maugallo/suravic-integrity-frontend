import { Routes } from "@angular/router";

export const HOME_ROUTES: Routes = [
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)}
]