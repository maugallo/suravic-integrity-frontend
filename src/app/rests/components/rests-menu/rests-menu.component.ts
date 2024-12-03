import { Component, inject } from '@angular/core';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { IonContent, IonButton } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
    selector: 'app-rests-menu',
    templateUrl: './rests-menu.component.html',
    styleUrls: ['./rests-menu.component.scss'],
    imports: [IonButton, IonContent, HeaderComponent],
standalone: true
})
export class RestsMenuComponent {

  public router = inject(Router);

}
