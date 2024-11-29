import { Routes } from '@angular/router';

export const RESTS_ROUTES: Routes = [
    { path: 'rests/menu', loadComponent: () => import('./components/rests-menu/rests-menu.component').then(m => m.RestsMenuComponent) }
]