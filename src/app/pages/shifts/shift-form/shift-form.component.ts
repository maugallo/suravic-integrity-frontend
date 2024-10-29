import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent } from "@ionic/angular/standalone";
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from 'src/app/core/services/shift.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { ShiftRequest } from 'src/app/core/models/interfaces/shift.model';
import { Observable, of, switchMap } from 'rxjs';
import { EntitiesUtility } from 'src/app/core/models/utils/entities.utility';
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { FormsModule } from '@angular/forms';
import { WheelTimeInputComponent } from "../../../shared/components/form/wheel-time-input/wheel-time-input.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { ShiftMapper } from 'src/app/core/models/mappers/shift.mapper';

@Component({
  selector: 'app-shift-form',
  templateUrl: './shift-form.component.html',
  styleUrls: ['./shift-form.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, SubmitButtonComponent, FormsModule, WheelTimeInputComponent, TextInputComponent]
})
export class ShiftFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private shiftService = inject(ShiftService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);

  public isShiftEdit!: boolean;
  private shiftId!: number;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent>;

  public shift: Signal<ShiftRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const shiftId = params!.get('id');
      if (this.isParameterValid(shiftId)) {
        const shift = this.shiftService.getShiftById(Number(shiftId));
        if (!shift) this.router.navigate(['providers', 'dashboard']);
        this.isShiftEdit = true;
        this.shiftId = shift.id;
        return of(ShiftMapper.toShiftRequest(shift));
      } else {
        this.isShiftEdit = false;
        return of(EntitiesUtility.getEmptyShiftRequest());
      }
    })
  ));

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }
    
    this.getFormOperation().subscribe({
      next: (response) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    });
  }

  private getFormOperation(): Observable<any> {
    return this.isShiftEdit
      ? this.shiftService.editShift(this.shiftId, this.shift()!)
      : this.shiftService.createShift(this.shift()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['shifts', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}