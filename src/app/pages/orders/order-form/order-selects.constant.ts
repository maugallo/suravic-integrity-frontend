interface PaymentMethod {
    title: string,
    value: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
    { title: 'Efectivo', value: 'Efectivo'},
    { title: 'Cheque', value: 'Cheque'},
    { title: 'Débito', value: 'Debito'},
    { title: 'Crédito', value: 'Credito'},
    { title: 'Transferencia', value: 'Transferencia'},
    { title: 'QR', value: 'QR'}
];

export const ORDER_STATUS: String[] = [
    'Pendiente',
    'Cancelado',
    'Pago'
];