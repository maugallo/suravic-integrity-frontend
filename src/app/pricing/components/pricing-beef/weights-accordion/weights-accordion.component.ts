import { UpperCasePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, Signal } from '@angular/core';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonBadge } from "@ionic/angular/standalone";
import { NumberInputComponent } from 'src/shared/components/form/number-input/number-input.component';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/shared/services/storage.service';
import { AlertService } from 'src/shared/services/alert.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { MeatDetailsService } from 'src/app/pricing/services/meat-details.service';
import { MeatDetailsType } from 'src/app/pricing/models/meat-details-type.enum';
import { MeatDetailsConstant } from 'src/app/pricing/models/meat-details-constant.enum';
import { ProductWithMeatDetails } from 'src/app/products/models/product.model';

@Component({
    selector: 'app-weights-accordion',
    templateUrl: './weights-accordion.component.html',
    styleUrls: ['./weights-accordion.component.scss'],
    imports: [IonBadge, IonLabel, IonItem, IonAccordion, IonAccordionGroup, UpperCasePipe, NumberInputComponent, SubmitButtonComponent, FormsModule]
})
export class WeightsAccordionComponent {

  private destroyRef = inject(DestroyRef);

  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private meatDetailsService = inject(MeatDetailsService);
  
  public showForm = false;

  public meatProducts: Signal<ProductWithMeatDetails[]> = this.meatDetailsService.meatDetails(MeatDetailsType.BEEF);
  private halfCarcassWeight: Signal<number> = toSignal(this.storageService.getStorage(MeatDetailsType.BEEF).pipe(
    switchMap((data) => data ? of(data) : of(MeatDetailsConstant.DEFAULT_HALF_CARCASS_WEIGHT))
  ));
  public halfCarcassWeightValue = this.halfCarcassWeight(); // Tendremos que usar una variable que "replique" el valor del signal, dado que nuestro input no soporta mandar un signal directamente (ni siquiera con '()').

  constructor() {
    effect(() => {
      this.halfCarcassWeightValue = this.halfCarcassWeight();
    });
  }

  public onSubmit() {
    if (!this.halfCarcassWeightValue) {
      return ;
    }

    this.meatProducts().forEach((meatProduct: ProductWithMeatDetails) => meatProduct.weight = this.calculateNewWeight(meatProduct.percentage));
    this.meatDetailsService.editMeatDetails(this.meatProducts()).pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private calculateNewWeight(percentage: number) {
    return Number(((percentage/100) * this.halfCarcassWeightValue).toFixed(1));
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response).fire();
    this.storageService.setStorage(MeatDetailsType.BEEF, this.halfCarcassWeightValue);

    this.showForm = false;
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

}


