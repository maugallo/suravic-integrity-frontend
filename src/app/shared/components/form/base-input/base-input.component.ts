import { Component, inject, input, model, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/utils/validation.service';

/* Componente base que define los campos y métodos que todos los custom-input
tendrán en común. */

@Component({
  template: ''
})
export abstract class BaseInputComponent {

  public validationService = inject(ValidationService);

  @ViewChild('ionInput', { static: true }) ionInput!: NgModel;

  public inputName = input<string>('');
  public bindedObject = model<any>();
  public label = input<string>();
  public placeHolder = input<string>('');
  public required = input<boolean>(true);

  public class = input<string>('');

  public markAsTouched() {
    if (this.ionInput) {
      this.ionInput.control.markAsTouched();
      this.ionInput.control.updateValueAndValidity();
    }
  }

}
