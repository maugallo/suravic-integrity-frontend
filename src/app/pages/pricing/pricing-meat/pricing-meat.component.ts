import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonInput, IonText, IonAccordion, IonItem, IonLabel, IonAccordionGroup, IonButton } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HALF_CARCASS_WEIGHT_AVERAGE, WEIGHT_AVERAGES } from 'src/app/core/constants/weight-average.constant';
import { NgFor, UpperCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { MinValueDirective } from 'src/app/shared/validators/min-value.directive';
import { MaxValueDirective } from 'src/app/shared/validators/max-value.directive';
import { AlertService } from 'src/app/core/services/utils/alert.service';

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
  private alertService = inject(AlertService);
  
  public weightAverages = WEIGHT_AVERAGES;
  public halfCarcassWeightAverage = HALF_CARCASS_WEIGHT_AVERAGE;
  
  public products = computed(() => signal(this.productsOnlyReadSignal())); // WritableSignal<Signal> para poder actualizar el array.
  private productsOnlyReadSignal = this.productsService.getProductsByCategory('carnes');
  public rawProducts = this.productsService.getProductsByCategory('carnes');
  
  public halfCarcassCost = signal('');
  public profitPercentage = signal('');

  public totalSellingPrice = computed(() => Number(this.halfCarcassCost()) * (Number(this.profitPercentage())/100));
  public totalProductSum = computed(() => this.products()().reduce((acumulatedSum, product) => acumulatedSum + Number(product.price), 0));

  public onCalculateSubmit(calculateForm: NgForm) {
    if (!calculateForm.valid) {
      calculateForm.form.markAllAsTouched();
      return;
    }
    this.calculatePrices();
  }

  public onApplySubmit(applyForm: NgForm) {
    if (!applyForm.valid) {
      applyForm.form.markAllAsTouched();
      return;
    }
    this.applyNewPrices();
  }

  private calculatePrices() {
    const productsWithCalculatedPrice = this.products()().map((product, index) => {
      const productPercentage = WEIGHT_AVERAGES[index].value / HALF_CARCASS_WEIGHT_AVERAGE.value;
      const productPrice = this.totalSellingPrice() * productPercentage;

      return {
        ...product,
        price: productPrice.toFixed(2)
      }
    });

    this.products().set(productsWithCalculatedPrice);
  }

  private applyNewPrices() {
    
  }

  public areThereChangesInPrices() { // Hacemos Number() ya que sino se pueden comprar en string '5400.0' con '5400' en el caso de que vuelva a poner el precio original.
    if (this.rawProducts().length > 0 && this.products()().length > 0) {
      return (this.rawProducts().some((product, index) => Number(product.price) !== Number(this.products()()[index].price)));
    }
    return false;
  }

}
