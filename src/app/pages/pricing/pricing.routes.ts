import { Routes } from '@angular/router';

export const PRICING_ROUTES: Routes = [
    { path: 'pricing/menu', loadComponent: () => import('./pricing-menu/pricing-menu.component').then(m => m.PricingMenuComponent) },
    { path: 'pricing/meat', loadComponent: () => import('./pricing-meat/pricing-meat.component').then(m => m.PricingMeatComponent) }
]