import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput } from "@ionic/angular/standalone";
import { BaseInputComponent } from '../base-input/base-input.component';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  standalone: true,
  imports: [IonInput, FormsModule, MaskitoDirective]
})
export class TextInputComponent extends BaseInputComponent {

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  public pattern = input<string | RegExp>('');
  public maxlength = input<string | number | null>(null);
  public minlength = input<string | number | null>(null);
  public email = input<boolean>(false);
  public maskito = input<MaskitoOptions | null>(null);

}

