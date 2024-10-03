import { AbstractControl, ValidationErrors } from '@angular/forms';

export function maxValueValidator(maxValue: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);

    // Si el valor es mayor que el valor mínimo o es NaN, devolvemos un error
    if (isNaN(value) || value > maxValue) {
      return { maxValue: { requiredValue: maxValue, actualValue: value } };
    }
    return null;
  };
}
