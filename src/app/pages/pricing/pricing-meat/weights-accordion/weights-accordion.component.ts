import { UpperCasePipe } from '@angular/common';
import { Component, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel } from "@ionic/angular/standalone";
import { NumberInputComponent } from "../../../../shared/components/form/number-input/number-input.component";
import { MEAT_CUTS } from '../meat-cuts.constant';
import { SubmitButtonComponent } from "../../../../shared/components/form/submit-button/submit-button.component";
import { FormsModule } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { SessionService } from 'src/app/core/services/utils/session.service';

@Component({
  selector: 'app-weights-accordion',
  templateUrl: './weights-accordion.component.html',
  styleUrls: ['./weights-accordion.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonAccordion, IonAccordionGroup, UpperCasePipe, NumberInputComponent, SubmitButtonComponent, FormsModule]
})
export class WeightsAccordionComponent {

  private validationService = inject(ValidationService);
  private sessionService = inject(SessionService);

  public meatCuts = MEAT_CUTS;
  public halfCarcassWeight = '';

  @ViewChildren(NumberInputComponent) inputComponent!: QueryList<NumberInputComponent>;

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponent)) {
      return ;
    }

    

    this.sessionService
  }

}
