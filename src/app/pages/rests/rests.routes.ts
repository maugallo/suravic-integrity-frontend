import { Routes } from '@angular/router';

export const RESTS_ROUTES: Routes = [
    { path: 'rests/menu', loadComponent: () => import('./rests-menu/rests-menu.component').then(m => m.RestsMenuComponent) },
    /* { path: 'rests/beef', loadComponent: () => import('./rests-beef/rests-beef.component').then(m => m.PricingBeefComponent) }, */
    /* { path: 'rests/chicken', loadComponent: () => import('./rests-chicken/rests-chicken.component').then(m => m.PricingChickenComponent) }, */
]