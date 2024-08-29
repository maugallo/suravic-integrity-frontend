import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./shared/components/footer/tabs.routes').then(m => m.TABS_ROUTES), canActivate: [authGuard]}
];
