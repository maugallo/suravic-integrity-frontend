import { Component, contentChildren, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonNote } from "@ionic/angular/standalone";
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
    selector: 'app-select-input',
    templateUrl: './select-input.component.html',
    styleUrls: ['./select-input.component.scss'],
    imports: [IonSelect, IonNote, FormsModule],
standalone: true
})
export class SelectInputComponent extends BaseInputComponent {

  public disabled = input<boolean>();
  public multiple = input<boolean>(false);

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' };

  public selectOptions = contentChildren('option');

  public isSelectValid(): boolean {
    if (this.multiple()) {
      return this.bindedObject().length > 0 || !this.required();
    } else {
      return (this.bindedObject() !== '' && this.bindedObject() !== -1 && this.bindedObject()) || !this.required();
    }
  }  

}
