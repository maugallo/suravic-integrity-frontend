export interface Option {
    icon: string,
    label: string,
    url: string
}

export const DUENO_OPTIONS: Option[] = [
    { icon: 'fa-solid fa-user fa-5x', label: 'USUARIOS', url: 'users/dashboard' },
    { icon: 'fa-solid fa-user-group fa-5x', label: 'PROVEEDORES', url: 'providers/dashboard' },
    { icon: 'fa-solid fa-briefcase fa-5x', label: 'EMPLEADOS', url: 'employees/dashboard' },
    { icon: 'fa-sharp fa-solid fa-boxes-stacked fa-5x', label: 'PRODUCTOS', url: 'products/dashboard' },
    { icon: 'fa-solid fa-calculator fa-5x', label: 'CÁLCULOS', url: 'pricing/menu' },
    { icon: 'fa-regular fa-clipboard-list fa-5x', label: 'PEDIDOS', url: 'orders/dashboard' },
    { icon: 'fa-solid fa-clock fa-5x', label: 'TURNOS', url: 'shifts/dashboard' },
    { icon: 'fa-regular fa-calendar-days fa-5x', label: 'FERIADOS', url: 'public-holidays/dashboard' },
    { icon: 'fa-solid fa-bed-front fa-5x', label: 'DESCANSOS', url: 'rests/menu' }
];

export const ENCARGADO_OPTIONS: Option[] = [
    { icon: 'fa-sharp fa-solid fa-boxes-stacked fa-5x', label: 'PRODUCTOS', url: 'products/dashboard' },
    { icon: 'fa-solid fa-briefcase fa-5x', label: 'EMPLEADOS', url: 'employees/dashboard' },
    { icon: 'fa-regular fa-clipboard-list fa-5x', label: 'PEDIDOS', url: 'orders/dashboard' },
    { icon: 'fa-solid fa-calculator fa-5x', label: 'CÁLCULOS', url: 'pricing/products' },
    { icon: 'fa-solid fa-user-group fa-5x', label: 'PROVEEDORES', url: 'providers/dashboard' }
];
