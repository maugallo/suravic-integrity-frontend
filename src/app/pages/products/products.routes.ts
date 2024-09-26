import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
    { path: 'products/dashboard', loadComponent: () => import('./product-dashboard/product-dashboard.component').then(m => m.ProductDashboardComponent) },
    { path: 'products/detail/:id', loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
    { path: 'products/form', loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent) },
    { path: 'products/form/:id', loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent) }
]