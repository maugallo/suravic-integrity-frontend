import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput } from "@ionic/angular/standalone";
import { MaxValueDirective } from 'src/app/shared/validators/max-value.directive';
import { MinValueDirective } from 'src/app/shared/validators/min-value.directive';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
    selector: 'app-number-input',
    templateUrl: './number-input.component.html',
    styleUrls: ['./number-input.component.scss'],
    imports: [IonInput, FormsModule, MinValueDirective, MaxValueDirective],
    standalone: true
})
export class NumberInputComponent extends BaseInputComponent {
  
  public minValue = input<number>();
  public maxValue = input<number>();
  public labelPlacement = input<'floating' | 'stacked'>('floating');
  public errorText = input<boolean>(true);
  public disabled = input<boolean>(false);
  public readOnly = input<boolean>(false);

  private changeDetectorRef = inject(ChangeDetectorRef);
  
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
  
}
