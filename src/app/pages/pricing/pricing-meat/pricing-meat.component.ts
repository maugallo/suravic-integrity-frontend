import { Component, computed, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { WeightsAccordionComponent } from "./weights-accordion/weights-accordion.component";
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { of, switchMap } from 'rxjs';
import { MEAT_CUTS, MeatCut } from './meat-cuts.constant';

@Component({
  selector: 'app-pricing-meat',
  templateUrl: './pricing-meat.component.html',
  styleUrls: ['./pricing-meat.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, FormsModule, UpperCasePipe, WeightsAccordionComponent, SubmitButtonComponent, NumberInputComponent, CurrencyPipe],
})
export class PricingMeatComponent {

  private productsService = inject(ProductService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);

  public products = computed(() => signal(this.productsOnlyReadSignal())); // WritableSignal<Signal> para poder actualizar el array.
  private productsOnlyReadSignal = this.productsService.getProductsByCategory('carnes');
  public rawProducts = this.productsService.getProductsByCategory('carnes');

  public halfCarcassCostPerKg = signal(0);
  public profitPercentage = signal(0);
  public tolerancePercentage = 1.5;

  public halfCarcassWeight = toSignal(this.storageService.getStorage('halfCarcassWeight').pipe(
    switchMap((data) => data ? of(data) : of(111))
  ));
  public meatCuts = toSignal(this.storageService.getStorage('weightAverages').pipe(
    switchMap((data) => data ? of(data) : of(MEAT_CUTS))
  ));

  public halfCarcassGrossCost = computed(() => this.halfCarcassCostPerKg() * this.halfCarcassWeight());
  public halfCarcassSellingPrice = computed(() => this.halfCarcassGrossCost() + (this.halfCarcassGrossCost() * (this.profitPercentage() / 100)));
  public currentMeatCutsPricesTotal = computed(() => this.products()().reduce((acumulatedSum, product) => {
    const productWeight = this.meatCuts().find((meatCut: MeatCut) => meatCut.id === product.id).weight;

    return acumulatedSum + (productWeight * Number(product.price));
  }, 0));

  public pricesDifference = computed(() => {
    if (this.halfCarcassSellingPrice() > 0 && this.profitPercentage() > 0 && this.currentMeatCutsPricesTotal() > 0) {
      return this.halfCarcassSellingPrice() - this.currentMeatCutsPricesTotal();
    }
    return null;
  });
  public pricesDifferencePercentage = computed(() => {
    if (this.pricesDifference()) {
      return Math.abs((this.pricesDifference()! / this.currentMeatCutsPricesTotal()) * 100);
    }
    return null;
  })

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

    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas continuar?', 'Se modificarán los precios de todos los productos de la lista', 'APLICAR')
    .fire()
    .then((result: any) => { if (result.isConfirmed) this.applyNewPrices(); });
  }

  private calculatePrices() {
    const products = this.products()().map(product => {
      if (product.id === 16) {
        const productWeight = this.meatCuts().find((meatCut: MeatCut) => meatCut.id === product.id).weight;

        const productCutCurrentValue = productWeight * Number(product.price);

        return {
          ...product,
          price: (productCutCurrentValue / 100).toString()
        }
      } else {

        const productWeight = this.meatCuts().find((meatCut: MeatCut) => meatCut.id === product.id).weight;

        const productCutCurrentValue = productWeight * Number(product.price);
        const productAdjustment = this.pricesDifference()! * (productWeight / this.halfCarcassWeight());

        const productCutNewValue = productCutCurrentValue + productAdjustment;

        console.log(`Producto: ${product.title}, peso: ${productWeight}kg`);
        console.log(`Precio actual de corte: ${productWeight}kg x $${product.price} = ${productCutCurrentValue}`);
        console.log(`Ajuste: $${this.pricesDifference()} x (${productWeight}kg / ${this.halfCarcassWeight()}kg) = ${productAdjustment}`);
        console.log(`Nuevo precio de corte: ${productCutCurrentValue} + ${productAdjustment} = ${productCutNewValue}`);
        console.log(`Nuevo precio de corte por kg: ${productCutNewValue}/${productWeight} = ${(productCutNewValue / productWeight).toFixed(2)}`);
        console.log("--------------------------------------");

        return {
          ...product,
          price: (productCutNewValue / productWeight).toFixed(2)
        }
      }
    });

    this.products().set(products);
    this.alertService.getSuccessToast('Precios calculados correctamente').fire();
  }

  private applyNewPrices() {
    this.productsService
  }

  public areThereChangesInPrices() { // Hacemos Number() ya que sino se pueden comprar en string '5400.0' con '5400' en el caso de que vuelva a poner el precio original.
    if (this.rawProducts().length > 0 && this.products()().length > 0) {
      return (this.rawProducts().some((product, index) => Number(product.price) !== Number(this.products()()[index].price)));
    }
    return false;
  }

}
