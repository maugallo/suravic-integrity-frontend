import { Component, computed, DestroyRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { WeightsAccordionComponent } from "./weights-accordion/weights-accordion.component";
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { MeatDetailsService } from 'src/app/core/services/meat-details.service';
import { FormButtonComponent } from "../../../shared/components/form/form-button/form-button.component";
import { MeatPricingService } from 'src/app/core/services/meat-pricing.service';

@Component({
  selector: 'app-pricing-beef',
  templateUrl: './pricing-beef.component.html',
  styleUrls: ['./pricing-beef.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent, HeaderComponent, FormsModule, UpperCasePipe, WeightsAccordionComponent, SubmitButtonComponent, NumberInputComponent, CurrencyPipe, FormButtonComponent],
})
export class PricingBeefComponent {

  private destroyRef = inject(DestroyRef);

  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private meatDetailService = inject(MeatDetailsService);
  private meatPricingService = inject(MeatPricingService);

  public meatDetails = computed(() => signal(this.meatDetailsOnlyReadSignal())); // WritableSignal<Signal> para poder actualizar el array.
  private meatDetailsOnlyReadSignal = this.meatDetailService.meatDetails("Carnes");

  public rawMeatDetails = this.meatDetailService.meatDetails("Carnes");

  public halfCarcassCostPerKg = signal(0);
  public profitPercentage = signal(0);
  public tolerancePercentage = 1.5;

  public halfCarcassWeight = toSignal(this.storageService.getStorage('Carnes').pipe(
    switchMap((data) => data ? of(data) : of(111))
  ));

  public halfCarcassGrossCost = computed(() => this.meatPricingService.calculateHalfCarcassGrossCost(this.halfCarcassCostPerKg(), this.halfCarcassWeight()));
  public halfCarcassSellingPrice = computed(() => this.meatPricingService.calculateHalfCarcassSellingPrice(this.halfCarcassGrossCost(), this.profitPercentage()));

  public meatCutCurrentPricesTotal = computed(() => signal(this.meatPricingService.calculateTotalMeatCutPrice(this.meatDetails()())));

  public pricesDifference = computed(() => this.meatPricingService.calculatePricesDifference(this.halfCarcassSellingPrice(), this.profitPercentage(), this.meatCutCurrentPricesTotal()()));
  public pricesDifferencePercentage = computed(() => this.meatPricingService.calculatePricesDifferencePercentage(this.pricesDifference()!, this.meatCutCurrentPricesTotal()()));

  public clearPrices() {
    this.meatDetails().set(this.rawMeatDetails());
  }

  @ViewChildren('calculateInput') inputsCalculate!: QueryList<NumberInputComponent>;
  @ViewChildren('priceInput') inputsPrice!: QueryList<NumberInputComponent>;

  public onPriceChange() {
    this.meatCutCurrentPricesTotal().set(this.meatDetails()().reduce((acumulatedSum, meatDetail) => acumulatedSum + (meatDetail.weight * Number(meatDetail.price)), 0));
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
    const updatedMeatDetails = this.meatPricingService.calculateAdjustedPrices(this.meatDetails()(), this.pricesDifference()!, this.halfCarcassWeight());

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
