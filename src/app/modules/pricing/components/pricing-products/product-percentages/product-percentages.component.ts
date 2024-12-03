import { Component, inject, input, output } from '@angular/core';
import { IonContent, IonMenu, IonSelectOption, MenuController } from "@ionic/angular/standalone";
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { FormButtonComponent } from 'src/app/shared/components/form/form-button/form-button.component';
import { ProductWithPricing } from 'src/app/modules/products/models/product.model';

@Component({
    selector: 'app-product-percentages',
    templateUrl: './product-percentages.component.html',
    styleUrls: ['./product-percentages.component.scss'],
    imports: [IonContent, IonMenu, SelectInputComponent, IonSelectOption, NumberInputComponent, FormButtonComponent],
standalone: true
})
export class ProductPercentagesComponent {;

  private menuController = inject(MenuController);

  public product = input<ProductWithPricing | null>();
  public percentageEmitter = output<ProductWithPricing>();

  public savePercentages(product: ProductWithPricing) {
    this.percentageEmitter.emit(product);
    this.menuController.close("product-percentages-menu" + product.id);
  }

}
