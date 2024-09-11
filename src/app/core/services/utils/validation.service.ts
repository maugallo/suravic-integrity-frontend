import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  public getErrorMessage(errors: any) {
    if (!errors) return '';
    if (errors.required) return 'Este campo es obligatorio';
    if (errors.minlength) return `Debe tener al menos ${errors.minlength.requiredLength} caracteres`;
    if (errors.maxlength) return `No deben haber más de ${errors.minlength.requiredLength} caracteres`;
    if (errors.email) return 'Debe cumplir el formato de email'
    if (errors.loginError) return errors.loginError;
    if (errors.userCreation) return errors.userCreation;
    if (errors.equalPasswords) return 'Las contraseñas no coinciden';
    if (errors.pattern) {
      const patternValue = errors.pattern.requiredPattern;
      if (patternValue === '^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$') return 'Solo se permiten letras';
      if (patternValue === '^[0-9]+$') return 'Solo se permiten números';
      if (patternValue === '^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]+$') return 'No se permiten caracteres especiales';
      else return 'El formato no es válido';
    }
    return 'No válido';
  }

}
