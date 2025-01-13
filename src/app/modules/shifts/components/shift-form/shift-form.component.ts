import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent } from "@ionic/angular/standalone";
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { Observable, of, switchMap } from 'rxjs';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { WheelTimeInputComponent } from 'src/app/shared/components/form/wheel-time-input/wheel-time-input.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShiftMapper } from 'src/app/shared/mappers/shift.mapper';
import { ShiftStore } from '../../store/shift.store';
import { watchState } from '@ngrx/signals';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';

@Component({
  selector: 'app-shift-form',
  templateUrl: './shift-form.component.html',
  styleUrls: ['./shift-form.component.scss'],
  imports: [IonContent, HeaderComponent, SubmitButtonComponent, FormsModule, WheelTimeInputComponent, TextInputComponent],
  standalone: true
})
export class ShiftFormComponent {

  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private shiftStore = inject(ShiftStore);
  private employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public shiftId = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent>;

  constructor() {
    watchState(this.shiftStore, () => {
      if (this.shiftStore.success()) this.handleSuccess(this.shiftStore.message());
      if (this.shiftStore.error()) this.handleError(this.shiftStore.message());
    });
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined))
  ));

  public shift = computed(() => {
    if (this.idParam()) {
      const shift = this.shiftStore.getEntityById(this.idParam()!);
      this.shiftId = shift.id;

      return ShiftMapper.toShiftRequest(shift);
    } else {
      return EntitiesUtility.getEmptyShiftRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.idParam()) {
      this.shiftStore.editEntity({ id: this.shiftId, entity: this.shift() });
      this.employeeStore.updateEntitiesByShift(this.shiftStore.lastUpdatedEntity()!);
    } else {
      this.shiftStore.addEntity(this.shift());
    }
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['shifts', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
    return of(null);
  }

}
