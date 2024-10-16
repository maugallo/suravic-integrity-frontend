import { Component, computed, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { WeightsAccordionComponent } from "./weights-accordion/weights-accordion.component";
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";

@Component({
  selector: 'app-pricing-meat',
  templateUrl: './pricing-meat.component.html',
  styleUrls: ['./pricing-meat.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, FormsModule, UpperCasePipe, WeightsAccordionComponent, SubmitButtonComponent, NumberInputComponent]
})
export class PricingMeatComponent {

  private productsService = inject(ProductService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  
  public products = computed(() => signal(this.productsOnlyReadSignal())); // WritableSignal<Signal> para poder actualizar el array.
  private productsOnlyReadSignal = this.productsService.getProductsByCategory('carnes');
  public rawProducts = this.productsService.getProductsByCategory('carnes');
  
  public halfCarcassCost = signal('');
  public profitPercentage = signal('');

  public totalSellingPrice = computed(() => Number(this.halfCarcassCost()) + (Number(this.halfCarcassCost()) * (Number(this.profitPercentage())/100)));
  public totalProductSum = computed(() => this.products()().reduce((acumulatedSum, product) => acumulatedSum + Number(product.price), 0));

  @ViewChildren('calculateInput') inputsCalculate!: QueryList<NumberInputComponent>;
  @ViewChildren('priceInput') inputsPrice!: QueryList<NumberInputComponent>;

  public onCalculateSubmit() {
    if (!this.validationService.validateInputs(this.inputsCalculate)) {
      return;
    }
    
    this.calculatePrices();
  }

  public onApplySubmit() {
    if (!this.validationService.validateInputs(this.inputsPrice)) {
      return;
    }

    this.applyNewPrices();
  }

  private calculatePrices() {
/*     const productsWithCalculatedPrice = this.products()().map((product, index) => {
      const productPercentage = WEIGHT_AVERAGES[index].value / HALF_CARCASS_WEIGHT_AVERAGE.value;
      console.log('Peso que ocupa ' + product.title + ' en una media res promedio');
      console.log( WEIGHT_AVERAGES[index].value + ' kg');
      console.log('precio de venta de una media res $' + this.totalSellingPrice());
      console.log('precio de venta del producto: $' + this.totalSellingPrice() + ' * ' + productPercentage);

      const productPrice = this.totalSellingPrice() * productPercentage;

      return {
        ...product,
        price: productPrice.toFixed(2)
      }
    });

    this.products().set(productsWithCalculatedPrice); */
  }

  private applyNewPrices() {
    alert('');
  }

  public areThereChangesInPrices() { // Hacemos Number() ya que sino se pueden comprar en string '5400.0' con '5400' en el caso de que vuelva a poner el precio original.
    if (this.rawProducts().length > 0 && this.products()().length > 0) {
      return (this.rawProducts().some((product, index) => Number(product.price) !== Number(this.products()()[index].price)));
    }
    return false;
  }

}
