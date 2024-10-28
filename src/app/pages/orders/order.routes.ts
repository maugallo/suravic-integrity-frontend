import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
    { path: 'orders/dashboard', loadComponent: () => import('./order-dashboard/order-dashboard.component').then(m => m.OrderDashboardComponent) },
    { path: 'orders/form', loadComponent: () => import('./order-form/order-form.component').then(m => m.OrderFormComponent) },
    { path: 'orders/form/:id', loadComponent: () => import('./order-form/order-form.component').then(m => m.OrderFormComponent) }
    /*  { path: 'orders/detail/:id', loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
        { path: 'orders/form', loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent) },
        { path: 'orders/form/:id', loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent) } */
]