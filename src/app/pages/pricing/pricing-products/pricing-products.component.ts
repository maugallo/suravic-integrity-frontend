import { Component, inject } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { SelectInputComponent } from "../../../shared/components/form/select-input/select-input.component";
import { ProviderService } from 'src/app/core/services/provider.service';
import { IonSelectOption } from "@ionic/angular/standalone";

@Component({
  selector: 'app-pricing-products',
  templateUrl: './pricing-products.component.html',
  styleUrls: ['./pricing-products.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, SelectInputComponent, IonSelectOption]
})
export class PricingProductsComponent {

  private providerService = inject(ProviderService);

  public providers = this.providerService.providers;

}
