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
    if (errors.loginError) return errors.loginError;
    if (errors.equalPasswords) return 'Las contraseñas no coinciden';

    return '';
  }

}
