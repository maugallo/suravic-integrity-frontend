import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { minValueValidator } from './min-value.validator';

@Directive({
  selector: '[minValue]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValueDirective, multi: true }],
  standalone: true
})
export class MinValueDirective implements Validator, OnChanges {
  private _minValue!: number;
  private _onChange?: () => void;

  @Input() // Necesario para que se puedan tomar parámetros con [].
  get minValue() {
    return this._minValue;
  }

  set minValue(value: any) {
    this._minValue = Number(value);
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return minValueValidator(this.minValue)(control);
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minValue']) {
      if (this._onChange) {
        this._onChange();
      }
    }
  }
}
