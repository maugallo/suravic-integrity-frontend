import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, Signal } from '@angular/core';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonBadge } from "@ionic/angular/standalone";
import { NumberInputComponent } from "../../../../shared/components/form/number-input/number-input.component";
import { MEAT_CUTS, MeatCut } from '../meat-cuts.constant';
import { SubmitButtonComponent } from "../../../../shared/components/form/submit-button/submit-button.component";
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
@Component({
  selector: 'app-weights-accordion',
  templateUrl: './weights-accordion.component.html',
  styleUrls: ['./weights-accordion.component.scss'],
  standalone: true,
  imports: [IonBadge, IonLabel, IonItem, IonAccordion, IonAccordionGroup, UpperCasePipe, NumberInputComponent, SubmitButtonComponent, FormsModule]
})
export class WeightsAccordionComponent {

  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  
  public showForm = false;

  public meatCuts: Signal<MeatCut[]> = toSignal(this.storageService.getStorage('weightAverages').pipe(
    switchMap((data) => data ? of(data) : of(MEAT_CUTS))
  ));
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

    this.meatCuts().forEach((meatCut: MeatCut) => meatCut.weight = this.calculateNewWeight(meatCut.percentage));
    
    this.storageService.setStorage('weightAverages', this.meatCuts());
    this.storageService.setStorage('halfCarcassWeight', this.halfCarcassWeightValue);

    this.showForm = false;
    this.alertService.getSuccessToast('Nuevos pesos aplicados').fire();
  }

  private calculateNewWeight(cutPercentage: number) {
    return Number(((cutPercentage/100) * this.halfCarcassWeightValue).toFixed(1));
  }

}
