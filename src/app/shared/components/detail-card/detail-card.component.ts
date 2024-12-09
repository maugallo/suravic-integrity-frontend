import { Component, input } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-detail-card',
    templateUrl: './detail-card.component.html',
    styleUrls: ['./detail-card.component.scss'],
    imports: [IonCardHeader, IonCard, IonCardContent],
standalone: true
})
export class DetailCardComponent {

  public values = input<string[]>([]);
  public title = input('');
  public icon = input('');

}
