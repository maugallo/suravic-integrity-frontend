import { Component, computed, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { WeightsAccordionComponent } from "./weights-accordion/weights-accordion.component";
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { FormButtonComponent } from 'src/app/shared/components/form/form-button/form-button.component';
import { MeatDetailsConstant } from '../../models/meat-details-constant.enum';
import { MeatDetailsStore } from '../../store/meat-details.store';
import { watchState } from '@ngrx/signals';
import { calculateAdjustedPrices, calculateMainCutGrossCost, calculateMainCutSellingCost, calculateMeatCutsCurrentPricesSum, calculatePricesDifference, calculatePricesDifferencePercentage } from '../../utils/pricing.utility';

@Component({
  selector: 'app-pricing-beef',
  templateUrl: './pricing-beef.component.html',
  styleUrls: ['./pricing-beef.component.scss'],
  imports: [IonContent, HeaderComponent, FormsModule, UpperCasePipe, WeightsAccordionComponent, SubmitButtonComponent, NumberInputComponent, CurrencyPipe, FormButtonComponent],
  standalone: true
})
export class PricingBeefComponent {

  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private meatDetailsStore = inject(MeatDetailsStore);

  public meatDetails = computed(() => this.meatDetailsStore.beefEntities());
  private rawMeatDetails = computed(() => this.meatDetailsStore.beefEntities());

  public halfCarcassCostPerKg = signal(0);
  public profitPercentage = signal(0);

  public tolerancePercentage = MeatDetailsConstant.TOLERANCE_PERCENTAGE;

  public halfCarcassWeight = computed(() => this.meatDetailsStore.halfCarcassWeight());

  public halfCarcassGrossCost = computed(() => calculateMainCutGrossCost(this.halfCarcassCostPerKg(), this.halfCarcassWeight()));
  public halfCarcassSellingCost = computed(() => calculateMainCutSellingCost(this.halfCarcassGrossCost(), this.profitPercentage()));

  public beefCutCurrentPricesSum = computed(() => calculateMeatCutsCurrentPricesSum(this.meatDetails()));

  public pricesDifference = computed(() => calculatePricesDifference(this.halfCarcassSellingCost(), this.profitPercentage(), this.beefCutCurrentPricesSum()));
  public pricesDifferencePercentage = computed(() => calculatePricesDifferencePercentage(this.pricesDifference()!, this.beefCutCurrentPricesSum()));

  @ViewChildren('calculateInput') inputsCalculate!: QueryList<NumberInputComponent>;
  @ViewChildren('priceInput') inputsPrice!: QueryList<NumberInputComponent>;

  constructor() {
    watchState(this.meatDetailsStore, () => {
      if (this.meatDetailsStore.success()) this.alertService.getSuccessToast(this.meatDetailsStore.message());
      if (this.meatDetailsStore.error()) this.handleError(this.meatDetailsStore.message());
    });
  }

  public clearPrices() {
    this.meatDetailsStore.setBeefEntities(this.rawMeatDetails());
  }

  public onPriceChange() {
    this.meatDetailsStore.setBeefEntities(this.meatDetails()); // Fuerza un nuevo seteo que vuelve a desatar el meatDetails().
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
    const updatedMeatDetails = calculateAdjustedPrices(this.meatDetails(), this.pricesDifference()!, this.beefCutCurrentPricesSum());

    this.meatDetailsStore.setBeefEntities(updatedMeatDetails);
    this.alertService.getSuccessToast('Precios calculados correctamente!');
  }

  private applyNewPrices() {
    this.meatDetailsStore.editBeefEntities(this.meatDetails());
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}
