import { Component, input } from '@angular/core';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    imports: []
})
export class NotFoundComponent  {

  public object = input<string>('coincidencias');

}
