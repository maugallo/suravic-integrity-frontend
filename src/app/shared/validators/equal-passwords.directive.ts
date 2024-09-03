import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { validateEqualPasswords } from './equal-passwords.validator';

@Directive({
  selector: '[equalPasswords]',
  providers: [ { provide: NG_VALIDATORS, useExisting: EqualPasswordsDirective, multi: true }],
  standalone: true
})
export class EqualPasswordsDirective implements Validator {

  private _equalTo: any;
  //onChange: Función que Angular llama para avisar a la directiva que algo cambió y debe hacerse la validación de nuevo. Comienza como null.
  private _onChange?: () => void;

  @Input() //@Input nos permite generar un setter y getter, y usar la entrada en el HTML de [equalTo]="". Cuando marcas una propiedad con @Input(), Angular crea automáticamente una entrada que puedes utilizar en la plantilla HTML. Esto permite la comunicación entre el componente y su plantilla, ya que los datos pueden fluir desde el componente hacia la plantilla.
  get equalTo() {
    return this._equalTo;
  }
  
  set equalTo(value: any) {
    this._equalTo = value;
    if (this._onChange) { //Valida si _onChange tiene un valor.
      this._onChange(); //Si tiene, entonces avisa que hay que re-validar.
    }
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return validateEqualPasswords(this.equalTo)(control);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }

}
