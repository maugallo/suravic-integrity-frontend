import { MaskitoOptions } from "@maskito/core";

// Máscara para DNI: XX.XXX.XXX o X.XXX.XXX
export const dniMask: MaskitoOptions = {
    mask: [
        /[1-9]/, /\d/,
        '.',
        /\d/, /\d/, /\d/,
        '.',
        /\d/, /\d/, /\d/
    ],
};