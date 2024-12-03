import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Si el path es exactamente vacío, redirecciona a home.
  { path: '', loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./shared/components/footer/tabs.routes').then(m => m.TABS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/users/users.routes').then(m => m.USERS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/providers/providers.routes').then(m => m.PROVIDERS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/products/products.routes').then(m => m.PRODUCTS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/pricing/pricing.routes').then(m => m.PRICING_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/orders/orders.routes').then(m => m.ORDERS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/shifts/shifts.routes').then(m => m.SHIFTS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/public-holidays/public-holidays.routes').then(m => m.PUBLIC_HOLIDAYS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/employees/employee.routes').then(m => m.EMPLOYEES_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/operations/operations.routes').then(m => m.OPERATIONS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/rests/rests.routes').then(m => m.RESTS_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/rests/days-off/days-off.routes').then(m => m.DAYS_OFF_ROUTES), canActivate: [authGuard] },
  { path: '', loadChildren: () => import('./modules/rests/licenses/licenses.routes').then(m => m.LICENSES_ROUTES), canActivate: [authGuard] },
  { path: '**', redirectTo: '/tabs/home' } // Si el path es otro valor no contemplado, redirecciona a home. (Necesario que vaya último)
];
