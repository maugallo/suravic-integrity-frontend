import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonInput, IonText, IonAccordion, IonItem, IonLabel, IonAccordionGroup, IonButton } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HALF_CARCASS_WEIGHT_AVERAGE, WEIGHT_AVERAGES } from 'src/app/core/constants/weight-average.constant';
import { UpperCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { MinValueDirective } from 'src/app/shared/validators/min-value.directive';
import { MaxValueDirective } from 'src/app/shared/validators/max-value.directive';

@Component({
  selector: 'app-pricing-meat',
  templateUrl: './pricing-meat.component.html',
  styleUrls: ['./pricing-meat.component.scss'],
  standalone: true,
  imports: [IonButton, IonAccordionGroup, IonLabel, IonItem, IonAccordion, IonText, IonInput, IonContent, HeaderComponent, FormsModule, UpperCasePipe, MinValueDirective, MaxValueDirective]
})
export class PricingMeatComponent {

  public validationService = inject(ValidationService);
  private productsService = inject(ProductService);
  
  public weightAverages = WEIGHT_AVERAGES;
  public halfCarcassWeightAverage = HALF_CARCASS_WEIGHT_AVERAGE;
  
  public products = this.productsService.getProductsByCategory('carnes');
  public rawProducts = this.productsService.getProductsByCategory('carnes');
  
  public halfCarcassCost = signal('');
  public profitPercentage = signal('');

  public totalSellingPrice = computed(() => {
    return Number(this.halfCarcassCost()) * (Number(this.profitPercentage())/100);
  });

  public totalProductSum = computed(() => {
    console.log("Los precios cambiaron, sumando de nuevo...")
    return this.products().reduce((acumulatedSum, product) => acumulatedSum + Number(product.price), 0)
  });

  public onSubmit(pricingForm: NgForm) {
    if (!pricingForm.valid) {
      pricingForm.form.markAllAsTouched();
      return;
    }
    this.calculatePrices();
  }

  public calculatePrices() {
    //this.products
  }

  public applyNewPrices() {
    
  }

  public areThereChangesInPrices() { // Hacemos Number() ya que sino se pueden comprar en string '5400.0' con '5400' en el caso de que vuelva a poner el precio original.
    return (this.rawProducts().some((product, index) => Number(product.price) !== Number(this.products()[index].price)));
  }

}
