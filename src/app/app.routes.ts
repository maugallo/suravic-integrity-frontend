import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/home/home.routes').then(m => m.HOME_ROUTES), canActivate: [authGuard] },
];
