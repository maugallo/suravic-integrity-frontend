import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel } from "@ionic/angular/standalone";
import { HALF_CARCASS_WEIGHT_AVERAGE, WEIGHT_AVERAGES } from 'src/app/pages/pricing/pricing-meat/weights.constant';

@Component({
  selector: 'app-weights-accordion',
  templateUrl: './weights-accordion.component.html',
  styleUrls: ['./weights-accordion.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonAccordion, IonAccordionGroup, UpperCasePipe]
})
export class WeightsAccordionComponent {

  public weightAverages = WEIGHT_AVERAGES;
  public halfCarcassWeightAverage = HALF_CARCASS_WEIGHT_AVERAGE;

}
