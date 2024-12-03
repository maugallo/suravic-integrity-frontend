import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { maxValueValidator } from './max-value.validator';

@Directive({
  selector: '[maxValue]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValueDirective, multi: true }],
  standalone: true
})
export class MaxValueDirective implements Validator, OnChanges {

  private _maxValue!: number;
  private _onChange?: () => void;

  @Input() // Necesario para que se puedan tomar parámetros con [].
  get maxValue() {
    return this._maxValue;
  }

  set maxValue(value: any) {
    this._maxValue = Number(value);
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return maxValueValidator(this.maxValue)(control);
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxValue']) {
      if (this._onChange) {
        this._onChange();
      }
    }
  }

}
