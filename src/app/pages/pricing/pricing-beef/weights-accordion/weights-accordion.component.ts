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
import { MeatDetailsService } from 'src/app/core/services/meat-details.service';
import { MeatDetails } from 'src/app/core/models/meat-details.model';

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
  private meatDetailsService = inject(MeatDetailsService);
  
  public showForm = false;

  public meatProducts: Signal<MeatDetails[]> = this.meatDetailsService.meatDetails("Pollos");
  private chickenWeight: Signal<number> = toSignal(this.storageService.getStorage('chicken').pipe(
    switchMap((data) => data ? of(data) : of(2.47))
  ));
  public chickenWeightValue = this.chickenWeight(); // Tendremos que usar una variable que "replique" el valor del signal, dado que nuestro input no soporta mandar un signal directamente (ni siquiera con '()').

  constructor() {
    effect(() => {
      this.chickenWeightValue = this.chickenWeight();
    });
  }

  public onSubmit() {
    if (!this.chickenWeightValue) {
      return ;
    }

    this.meatProducts().forEach((meatProduct: MeatDetails) => meatProduct.weight = this.calculateNewWeight(meatProduct.percentage));
    this.meatDetailsService.editMeatDetails(this.meatProducts()).pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private calculateNewWeight(percentage: number) {
    return Number(((percentage/100) * this.chickenWeightValue).toFixed(1));
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response).fire();
    this.storageService.setStorage('chicken', this.chickenWeightValue);

    this.showForm = false; // ANALIZAR SI DEJARLO O NO USAR UNA VARIABLE PARA MANEJAR LA VISIBILIDAD DEL FORM.
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

}


