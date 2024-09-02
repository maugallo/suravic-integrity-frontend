import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/tabs/home', pathMatch: 'full' }, // Si el path es exactamente vacío, redirecciona a home.
  { path: '', loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./shared/components/footer/tabs.routes').then(m => m.TABS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/users/users.routes').then(m => m.USERS_ROUTES), canActivate: [authGuard] },
  { path: '**', redirectTo: '/tabs/home' } // Si el path es otro valor no contemplado, redirecciona a home. (Necesario que vaya último)
];
