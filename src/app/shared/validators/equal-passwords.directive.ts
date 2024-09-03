import { Directive } from '@angular/core';

@Directive({
  selector: '[appEqualPasswords]',
  standalone: true
})
export class EqualPasswordsDirective {

  constructor() { }

}
