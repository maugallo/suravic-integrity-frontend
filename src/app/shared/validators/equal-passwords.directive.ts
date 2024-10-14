import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { validateEqualPasswords } from './equal-passwords.validator';

@Directive({
  selector: '[equalPasswords]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EqualPasswordsDirective, multi: true }],
  standalone: true
})
export class EqualPasswordsDirective implements Validator {

  private _equalTo: any;
  private _validatePasswords: boolean = true; // Por defecto la validación está activa
  private _onChange?: () => void;

  @Input()
  get equalTo() {
    return this._equalTo;
  }

  set equalTo(value: any) {
    this._equalTo = value;
    if (this._onChange) {
      this._onChange();
    }
  }

  @Input()
  set validatePasswords(value: boolean) {
    this._validatePasswords = value;
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!this._validatePasswords) {
      return null;
    }
    return validateEqualPasswords(this.equalTo)(control);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
