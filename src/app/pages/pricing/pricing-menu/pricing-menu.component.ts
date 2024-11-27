import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { OptionLargeComponent } from "../../../shared/components/option-large/option-large.component";

@Component({
  selector: 'app-pricing-menu',
  templateUrl: './pricing-menu.component.html',
  styleUrls: ['./pricing-menu.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent, HeaderComponent, OptionLargeComponent]
})
export class PricingMenuComponent {

  public router = inject(Router);

}
