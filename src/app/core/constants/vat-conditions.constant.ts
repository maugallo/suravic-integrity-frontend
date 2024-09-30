export interface VatCondition {
    title: string,
    value: string
};

export const VAT_CONDITIONS: VatCondition[] = [
    { title: 'IVA Responsable Inscripto', value: 'IVA_RESPONSABLE_INSCRIPTO' },
    { title: 'IVA Responsable No Inscripto', value: 'IVA_RESPONSABLE_NO_INSCRIPTO' },
    { title: 'IVA No Responsable', value: 'IVA_NO_RESPONSABLE' },
    { title: 'IVA Sujeto Exento', value: 'IVA_SUJETO_EXENTO' },
    { title: 'Consumidor Final', value: 'CONSUMIDOR_FINAL' },
    { title: 'Responsable Monotributo', value: 'RESPONSABLE_MONOTRIBUTO' },
    { title: 'Sujeto No Categorizado', value: 'SUJETO_NO_CATEGORIZADO' },
    { title: 'Proveedor del Exterior', value: 'PROVEEDOR_DEL_EXTERIOR' },
    { title: 'Cliente del Exterior', value: 'CLIENTE_DEL_EXTERIOR' },
    { title: 'IVA Liberado', value: 'IVA_LIBERADO' },
    { title: 'Agente de Percepción', value: 'AGENTE_DE_PERCEPCION' },
    { title: 'Pequeño Contribuyente Eventual', value: 'PEQUEÑO_CONTRIBUYENTE_EVENTUAL' },
    { title: 'Monotributista Social', value: 'MONOTRIBUTISTA_SOCIAL' },
    { title: 'Pequeño Contribuyente Eventual Social', value: 'PEQUEÑO_CONTRIBUYENTE_EVENTUAL_SOCIAL' }
];
