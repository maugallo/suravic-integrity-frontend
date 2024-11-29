import { Routes } from '@angular/router';

export const PRICING_ROUTES: Routes = [
    { path: 'pricing/menu', loadComponent: () => import('./pricing-menu/pricing-menu.component').then(m => m.PricingMenuComponent) },
    { path: 'pricing/beef', loadComponent: () => import('./pricing-beef/pricing-beef.component').then(m => m.PricingBeefComponent) },
    { path: 'pricing/chicken', loadComponent: () => import('./pricing-chicken/pricing-chicken.component').then(m => m.PricingChickenComponent) },
    { path: 'pricing/products', loadComponent: () => import('./pricing-products/pricing-products.component').then(m => m.PricingProductsComponent) }
]