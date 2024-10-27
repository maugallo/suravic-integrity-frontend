import { Injectable, QueryList } from '@angular/core';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { PasswordInputComponent } from 'src/app/shared/components/form/password-input/password-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  public getErrorMessage(errors: any) {
    if (!errors) return '';
    if (errors.required) return 'Este campo es obligatorio';
    if (errors.email) return 'Debe cumplir el formato de email'
    if (errors.userCreation) return errors.userCreation;
    if (errors.equalPasswords) return 'Las contraseñas no coinciden';
    if (errors.minValue) return `El valor ingresado debe ser mayor a ${errors.minValue.requiredValue}`;
    if (errors.maxValue) return `El valor ingresado debe ser menor a ${errors.maxValue.requiredValue}`;
    if (errors.minlength) return `Deben haber al menos ${errors.minlength.requiredLength} caracteres`;
    if (errors.maxlength) return `No puedes superar los ${errors.maxlength.requiredLength} caracteres`;
    if (errors.pattern) {
      const patternValue = errors.pattern.requiredPattern;
      if (patternValue === '^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') return 'Solo se permiten letras';
      if (patternValue === '^[0-9]+$') return 'Solo se permiten números';
      if (patternValue === '^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]+$') return 'No se permiten caracteres especiales';
      else return 'El formato no es válido';
    }
    return 'No válido';
  }

  public validateInputs(inputComponents: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent | PasswordInputComponent>): boolean {
    let isValid = true;

    inputComponents.forEach((input) => {
      input.markAsTouched();

      if (input instanceof SelectInputComponent) {
        if (!input.isSelectValid()) {
          isValid = false;
        }
      } else if (!input.ionInput.control.valid) {
        isValid = false;
      }
    });

    return isValid;
  }

}
