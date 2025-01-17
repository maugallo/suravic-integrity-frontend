import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonBadge } from "@ionic/angular/standalone";
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProductWithMeatDetails } from 'src/app/modules/products/models/product.model';
import { MeatDetailsStore } from '../../../store/meat-details.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-weights-accordion',
  templateUrl: './weights-accordion.component.html',
  styleUrls: ['./weights-accordion.component.scss'],
  imports: [IonBadge, IonLabel, IonItem, IonAccordion, IonAccordionGroup, UpperCasePipe, NumberInputComponent, SubmitButtonComponent, FormsModule],
  standalone: true
})
export class WeightsAccordionComponent {

  private meatDetailsStore = inject(MeatDetailsStore);
  private alertService = inject(AlertService);

  public showForm = false;

  public meatProducts = computed(() => this.meatDetailsStore.beefEntities());
  
  private halfCarcassWeight = computed(() => this.meatDetailsStore.halfCarcassWeight());
  public halfCarcassWeightValue = this.halfCarcassWeight(); // Tendremos que usar una variable que "replique" el valor del signal, dado que nuestro input no soporta mandar un signal directamente (ni siquiera con '()').

  constructor() {
    watchState(this.meatDetailsStore, () => {
      if (this.meatDetailsStore.success()) this.handleSuccess(this.meatDetailsStore.message());
      if (this.meatDetailsStore.error()) this.handleError(this.meatDetailsStore.message());
    });
    effect(() => {
      this.halfCarcassWeightValue = this.halfCarcassWeight();
    });
  }

  public onSubmit() {
    if (!this.halfCarcassWeightValue) {
      return;
    }

    this.meatProducts().forEach((meatProduct: ProductWithMeatDetails) => meatProduct.weight = this.calculateNewWeight(meatProduct.percentage));
    this.meatDetailsStore.editBeefEntities(this.meatProducts());
  }

  private calculateNewWeight(percentage: number) {
    return Number(((percentage / 100) * this.halfCarcassWeightValue).toFixed(1));
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response);
    this.meatDetailsStore.setHalfCarcassWeight(this.halfCarcassWeightValue);

    this.showForm = false;
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}


