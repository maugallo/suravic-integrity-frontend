import { Component, computed, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent } from "@ionic/angular/standalone";
import { WeightsAccordionComponent } from './weights-accordion/weights-accordion.component';
import { FormsModule } from '@angular/forms';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { FormButtonComponent } from 'src/app/shared/components/form/form-button/form-button.component';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MeatDetailsConstant } from '../../models/meat-details-constant.enum';
import { MeatDetailsStore } from '../../store/meat-details.store';
import { calculateAdjustedPrices, calculateMainCutGrossCost, calculateMainCutSellingCost, calculateMeatCutsCurrentPricesSum, calculatePricesDifference, calculatePricesDifferencePercentage } from '../../utils/pricing.utility';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-pricing-chicken',
  templateUrl: './pricing-chicken.component.html',
  styleUrls: ['./pricing-chicken.component.scss'],
  imports: [IonContent, HeaderComponent, WeightsAccordionComponent, FormsModule, NumberInputComponent, SubmitButtonComponent, FormButtonComponent, CurrencyPipe, UpperCasePipe],
  standalone: true
})
export class PricingChickenComponent {

  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private meatDetailsStore = inject(MeatDetailsStore);

  public meatDetails = computed(() => this.meatDetailsStore.chickenEntities());
  private rawMeatDetails = computed(() => this.meatDetailsStore.rawChickenEntities())

  public chickenBoxCost = signal(0);
  public profitPercentage = signal(0);
  
  public tolerancePercentage = MeatDetailsConstant.TOLERANCE_PERCENTAGE;
  
  public chickenWeight = computed(() => this.meatDetailsStore.chickenWeight());
  
  public chickenBoxCostPerKg = computed(() => this.chickenBoxCost() / 19.5);
  public chickenGrossCost = computed(() => calculateMainCutGrossCost(this.chickenBoxCostPerKg(), this.chickenWeight()));
  public chickenSellingCost = computed(() => calculateMainCutSellingCost(this.chickenGrossCost(), this.profitPercentage()));

  public chickenCutsCurrentPricesSum = computed(() => calculateMeatCutsCurrentPricesSum(this.meatDetails()));

  public pricesDifference = computed(() => calculatePricesDifference(this.chickenSellingCost(), this.profitPercentage(), this.chickenCutsCurrentPricesSum()));
  public pricesDifferencePercentage = computed(() => calculatePricesDifferencePercentage(this.pricesDifference()!, this.chickenCutsCurrentPricesSum()));

  @ViewChildren('calculateInput') inputsCalculate!: QueryList<NumberInputComponent>;
  @ViewChildren('priceInput') inputsPrice!: QueryList<NumberInputComponent>;

  constructor() {
    watchState(this.meatDetailsStore, () => {
      if (this.meatDetailsStore.success()) this.handleSuccess(this.meatDetailsStore.message());
      if (this.meatDetailsStore.error()) this.handleError(this.meatDetailsStore.message());
    });
  }

  public clearPrices() {
    console.log(this.meatDetails()[0].price);
    console.log(this.rawMeatDetails()[0].price);
    this.meatDetailsStore.setChickenEntities(this.rawMeatDetails());
  }

  public onPriceChange() {
    console.log(this.meatDetails()[0].price);
    console.log(this.rawMeatDetails()[0].price);
    this.meatDetailsStore.setChickenEntities(this.meatDetails()); // Fuerza un nuevo seteo que vuelve a desatar el meatDetails().
  }

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
      .then((result: any) => {
        if (result.isConfirmed) this.applyNewPrices();
      });
  }

  private calculatePrices() {
    const updatedMeatDetails = calculateAdjustedPrices(this.meatDetails(), this.pricesDifference()!, this.chickenCutsCurrentPricesSum());

    this.meatDetailsStore.setChickenEntities(updatedMeatDetails);
    this.alertService.getSuccessToast('Precios calculados correctamente!');
  }

  private applyNewPrices() {
    this.meatDetailsStore.editChickenEntities(this.meatDetails());
  }

  private handleSuccess(message: string) {
    this.alertService.getSuccessToast(message);
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}
