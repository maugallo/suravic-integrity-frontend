import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Si el path es exactamente vacío, redirecciona a home.
  { path: '', loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AUTH_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./shared/components/footer/tabs.routes').then(m => m.TABS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/users/users.routes').then(m => m.USERS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/providers/providers.routes').then(m => m.PROVIDERS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/products/products.routes').then(m => m.PRODUCTS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/pricing/pricing.routes').then(m => m.PRICING_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/orders/orders.routes').then(m => m.ORDERS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/shifts/shifts.routes').then(m => m.SHIFTS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/public-holidays/public-holidays.routes').then(m => m.PUBLIC_HOLIDAYS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/employees/employee.routes').then(m => m.EMPLOYEES_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./pages/day-off/days-off.routes').then(m => m.DAYS_OFF_ROUTES), canActivate: [authGuard] },
  { path: '**', redirectTo: '/tabs/home' } // Si el path es otro valor no contemplado, redirecciona a home. (Necesario que vaya último)
];
