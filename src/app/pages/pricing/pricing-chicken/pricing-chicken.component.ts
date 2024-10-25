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
import { WeightsAccordionComponent } from "../pricing-beef/weights-accordion/weights-accordion.component";
import { FormsModule } from '@angular/forms';
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { FormButtonComponent } from "../../../shared/components/form/form-button/form-button.component";
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MeatDetails } from 'src/app/core/models/meat-details.model';

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

  public meatDetails = computed(() => signal(this.meatDetailsOnlyReadSignal())); // WritableSignal<Signal> para poder actualizar el array.
  private meatDetailsOnlyReadSignal = this.meatDetailService.meatDetails("Pollos");

  public rawMeatDetails = this.meatDetailService.meatDetails("Pollos");

  public chickenBoxCost = signal(0);
  public profitPercentage = signal(0);
  public tolerancePercentage = 1.5;

  public chickenWeight = toSignal(this.storageService.getStorage('Pollos').pipe(
    switchMap((data) => data ? of(data) : of(2.47))
  ));

  public chickenBoxCostPerKg = computed(() => this.chickenBoxCost() / 19.5);
  public chickenGrossCost = computed(() => this.chickenBoxCostPerKg() * this.chickenWeight());
  public chickenSellingCost = computed(() => this.chickenGrossCost() * (this.profitPercentage()/100));

  public chickenCutsCurrentPricesTotal = computed(() => signal(this.meatDetails()().reduce((accumulatedSum, meatDetail) => accumulatedSum + (meatDetail.weight * Number(meatDetail.price)), 0)));

  public pricesDifference = computed(() => this.calculatePricesDifference(this.chickenSellingCost(), this.profitPercentage(), this.chickenCutsCurrentPricesTotal()()))
  // Encapsular a servicio...
  private calculatePricesDifference(chickenSellingCost: number, profitPercentage: number, chickenCutsCurrentPricesTotal: number) {
    if (chickenSellingCost > 0 && profitPercentage > 0 && chickenCutsCurrentPricesTotal > 0) {
      return chickenSellingCost - chickenCutsCurrentPricesTotal;
    }
    return null;
  }

  public pricesDifferencePercentage = computed(() => this.calculatePricesDifferencePercentage(this.pricesDifference()!, this.chickenCutsCurrentPricesTotal()()))
  // Encapsular a servicio...
  private calculatePricesDifferencePercentage(pricesDifference: number, chickenCutsCurrentPricesTotal: number) {
    if (pricesDifference) {
      return Math.abs((pricesDifference! / chickenCutsCurrentPricesTotal) * 100);
    }
    return null;
  }

  public clearPrices() {
    this.meatDetails().set(this.rawMeatDetails());
  }

  @ViewChildren('calculateInput') inputsCalculate!: QueryList<NumberInputComponent>;
  @ViewChildren('priceInput') inputsPrice!: QueryList<NumberInputComponent>;

  public onPriceChange() {
    this.chickenCutsCurrentPricesTotal().set(this.meatDetails()().reduce((acumulatedSum, meatDetail) => acumulatedSum + (meatDetail.weight * Number(meatDetail.price)), 0));
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
    const updatedMeatDetails = this.calculateAdjustedPrices(this.meatDetails()(), this.pricesDifference()!, this.chickenWeight());

    this.meatDetails().set(updatedMeatDetails);
    this.alertService.getSuccessToast('Precios calculados correctamente').fire();
  } // Encapsular a servicio...
  private calculateAdjustedPrices(meatDetails: MeatDetails[], pricesDifference: number, halfCarcassWeight: number): MeatDetails[] {
    return meatDetails.map(meatDetail => {
      const chickenCutCurrentPrice = meatDetail.weight * Number(meatDetail.price);
      const chickenCutAdjustment = pricesDifference * (meatDetail.weight / halfCarcassWeight);
      const chickenCutNewPrice = chickenCutCurrentPrice + chickenCutAdjustment;
      const chickenDetailNewPrice = this.roundToNearestTen(Number((chickenCutNewPrice / meatDetail.weight).toFixed(0)));
      
      return {
        ...meatDetail,
        price: chickenDetailNewPrice.toString(),
      };
    });
  }
  private roundToNearestTen(value: number): number {
    const lastDigit = value % 10;

    if (lastDigit >= 5) return value + (10 - lastDigit); // Redondear hacia arriba
    else return value - lastDigit; // Redondear hacia abajo
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
