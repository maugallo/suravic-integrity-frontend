import { Component, input } from '@angular/core';
import { BaseInputComponent } from '../base-input/base-input.component';
import { IonInput } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { EqualPasswordsDirective } from 'src/app/shared/validators/equal-passwords.directive';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  standalone: true,
  imports: [IonInput, FormsModule, EqualPasswordsDirective]
})
export class PasswordInputComponent extends BaseInputComponent {

  public maxlength = input<string | number | null>(null);
  public minlength = input<string | number | null>(null);
  public validatePasswords = input<boolean>(false);
  public equalTo = input<any>(null);

}
