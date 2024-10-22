import { UpperCasePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, Signal } from '@angular/core';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonBadge } from "@ionic/angular/standalone";
import { NumberInputComponent } from "../../../../shared/components/form/number-input/number-input.component";
import { SubmitButtonComponent } from "../../../../shared/components/form/submit-button/submit-button.component";
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { MeatProduct } from 'src/app/core/models/meat-product.model';
import { MeatProductService } from 'src/app/core/services/meat-product.service';
@Component({
  selector: 'app-weights-accordion',
  templateUrl: './weights-accordion.component.html',
  styleUrls: ['./weights-accordion.component.scss'],
  standalone: true,
  imports: [IonBadge, IonLabel, IonItem, IonAccordion, IonAccordionGroup, UpperCasePipe, NumberInputComponent, SubmitButtonComponent, FormsModule]
})
export class WeightsAccordionComponent {

  private destroyRef = inject(DestroyRef);

  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private meatProductService = inject(MeatProductService);
  
  public showForm = false;

  public meatProducts: Signal<MeatProduct[]> = this.meatProductService.meatProducts;
  private halfCarcassWeight: Signal<number> = toSignal(this.storageService.getStorage('halfCarcassWeight').pipe(
    switchMap((data) => data ? of(data) : of(111))
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

    this.meatProducts().forEach((meatProduct: MeatProduct) => meatProduct.weight = this.calculateNewWeight(meatProduct.percentage));
    this.meatProductService.editMeatProducts(this.meatProducts()).pipe(
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
    this.storageService.setStorage('halfCarcassWeight', this.halfCarcassWeightValue);
    this.showForm = false; // ANALIZAR SI DEJARLO O NO USAR UNA VARIABLE PARA MANEJAR LA VISIBILIDAD DEL FORM.

    this.meatProductService.refreshMeatProducts();
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

}
