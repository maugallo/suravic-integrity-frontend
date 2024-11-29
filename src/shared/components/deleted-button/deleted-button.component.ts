import { Component, model } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
    selector: 'app-deleted-button',
    templateUrl: './deleted-button.component.html',
    styleUrls: ['./deleted-button.component.scss'],
    imports: [IonButton,]
})
export class DeletedButtonComponent {

  public seeDeleted = model<boolean>(false);
  
}
