import { Component, computed, inject, signal } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { SelectInputComponent } from "../../../shared/components/form/select-input/select-input.component";
import { ProviderService } from 'src/app/core/services/provider.service';
import { IonSelectOption } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { UpperCasePipe } from '@angular/common';
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";

@Component({
  selector: 'app-pricing-products',
  templateUrl: './pricing-products.component.html',
  styleUrls: ['./pricing-products.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, SelectInputComponent, IonSelectOption, UpperCasePipe, NumberInputComponent]
})
export class PricingProductsComponent {

  private providerService = inject(ProviderService);
  private productService = inject(ProductService);

  public providers = this.providerService.providers;

  public selectedProviderId = signal<number | undefined>(undefined);

  public provider = computed(() => this.selectedProviderId() ? this.providerService.getProviderById(this.selectedProviderId()!) : null);
  public products = computed(() => this.selectedProviderId() ? this.productService.getProductsByProvider(this.selectedProviderId()!) : null);



}