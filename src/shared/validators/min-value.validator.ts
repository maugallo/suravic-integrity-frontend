import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minValueValidator(minValue: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);

    // Si el valor es menor que el valor mínimo o es NaN, devolvemos un error
    if (isNaN(value) || value <= minValue) {
      return { minValue: { requiredValue: minValue, actualValue: value } };
    }
    return null;
  };
}
