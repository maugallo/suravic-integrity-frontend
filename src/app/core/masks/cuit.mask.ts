import { MaskitoOptions } from "@maskito/core";

// Máscara para CUIT: 99-99999999-9
export const cuitMask: MaskitoOptions = {
    mask: [
        /\d/, /\d/,
        '-',
        ...Array(8).fill(/\d/),
        '-',
        /\d/
    ],
};
