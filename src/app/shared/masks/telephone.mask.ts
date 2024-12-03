import { MaskitoOptions } from "@maskito/core";

// Máscara para teléfono: Solo acepta números, máximo 12
export const telephoneMask: MaskitoOptions = {
    mask: Array(12).fill(/\d/)
};
