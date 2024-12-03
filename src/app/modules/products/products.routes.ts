import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
    { path: 'products/dashboard', loadComponent: () => import('./components/product-dashboard/product-dashboard.component').then(m => m.ProductDashboardComponent) },
    { path: 'products/detail/:id', loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
    { path: 'products/form', loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent) },
    { path: 'products/form/:id', loadComponent: () => import('./components/product-form/product-form.component').then(m => m.ProductFormComponent) }
]