import { Component, computed, DestroyRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { MeatDetailsService } from 'src/app/core/services/meat-details.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent } from "@ionic/angular/standalone";
import { WeightsAccordionComponent } from './weights-accordion/weights-accordion.component';
import { FormsModule } from '@angular/forms';
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { FormButtonComponent } from "../../../shared/components/form/form-button/form-button.component";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MeatDetailsType } from 'src/app/core/models/enums/meat-details-type.enum';
import { PricingService } from 'src/app/core/services/pricing.service';
import { MeatDetailsConstant } from 'src/app/core/models/enums/meat-details-constant.enum';

@Component({
  selector: 'app-pricing-chicken',
  templateUrl: './pricing-chicken.component.html',
  styleUrls: ['./pricing-chicken.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, WeightsAccordionComponent, FormsModule, NumberInputComponent, SubmitButtonComponent, FormButtonComponent, CurrencyPipe, UpperCasePipe]
})
export class PricingChickenComponent {

  private destroyRef = inject(DestroyRef);

  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private meatDetailService = inject(MeatDetailsService);
  private pricingService = inject(PricingService)

  public meatDetails = computed(() => signal(this.meatDetailsOnlyReadSignal())); // WritableSignal<Signal> para poder actualizar el array.
  private meatDetailsOnlyReadSignal = this.meatDetailService.meatDetails(MeatDetailsType.CHICKEN);

  public rawMeatDetails = this.meatDetailService.meatDetails(MeatDetailsType.CHICKEN);

  public chickenBoxCost = signal(0);
  public profitPercentage = signal(0);
  public tolerancePercentage = MeatDetailsConstant.TOLERANCE_PERCENTAGE;

  public chickenWeight = toSignal(this.storageService.getStorage(MeatDetailsType.CHICKEN).pipe(
    switchMap((data) => data ? of(data) : of(MeatDetailsConstant.DEFAULT_CHICKEN_WEIGHT))
  ));

  public chickenBoxCostPerKg = computed(() => this.chickenBoxCost() / 19.5);
  public chickenGrossCost = computed(() => this.pricingService.calculateMainCutGrossCost(this.chickenBoxCostPerKg(), this.chickenWeight()));
  public chickenSellingCost = computed(() => this.pricingService.calculateMainCutSellingCost(this.chickenGrossCost(), this.profitPercentage()));

  public chickenCutsCurrentPricesTotal = computed(() => signal(this.pricingService.calculateMeatCutsCurrentPricesSum(this.meatDetails()())));

  public pricesDifference = computed(() => this.pricingService.calculatePricesDifference(this.chickenSellingCost(), this.profitPercentage(), this.chickenCutsCurrentPricesTotal()()))

  public pricesDifferencePercentage = computed(() => this.pricingService.calculatePricesDifferencePercentage(this.pricesDifference()!, this.chickenCutsCurrentPricesTotal()()))

  public clearPrices() {
    this.meatDetails().set(this.rawMeatDetails());
  }

  @ViewChildren('calculateInput') inputsCalculate!: QueryList<NumberInputComponent>;
  @ViewChildren('priceInput') inputsPrice!: QueryList<NumberInputComponent>;

  public onPriceChange() {
    this.chickenCutsCurrentPricesTotal().set(this.pricingService.calculateMeatCutsCurrentPricesSum(this.meatDetails()()));
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
      .fire()
      .then((result: any) => { if (result.isConfirmed) this.applyNewPrices(); });
  }

  private calculatePrices() {
    const updatedMeatDetails = this.pricingService.calculateAdjustedPrices(this.meatDetails()(), this.pricesDifference()!, this.chickenCutsCurrentPricesTotal()(), MeatDetailsType.CHICKEN);

    this.meatDetails().set(updatedMeatDetails);
    this.alertService.getSuccessToast('Precios calculados correctamente').fire();
  }

  private applyNewPrices() {
    this.meatDetailService.editMeatDetails(this.meatDetails()()).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

}
