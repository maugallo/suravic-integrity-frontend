import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { PublicHolidayMapper } from 'src/app/shared/mappers/public-holiday.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { WheelDateInputComponent } from 'src/app/shared/components/form/wheel-date-input/wheel-date-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { ShiftStore } from 'src/app/modules/shifts/store/shift.store';
import { PublicHolidayStore } from '../../store/public-holidays.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-public-holiday-form',
  templateUrl: './public-holiday-form.component.html',
  styleUrls: ['./public-holiday-form.component.scss'],
  imports: [IonContent, HeaderComponent, TextInputComponent, WheelDateInputComponent, SubmitButtonComponent, FormsModule, SelectInputComponent, IonSelectOption],
  standalone: true
})
export class PublicHolidayFormComponent {

  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private publicHolidayStore = inject(PublicHolidayStore);
  private shiftStore = inject(ShiftStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public shifts = computed(() => this.shiftStore.enabledEntities());

  public publicHolidayId = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent>;

  constructor() {
    watchState(this.publicHolidayStore, () => {
      if (this.publicHolidayStore.success()) this.handleSuccess(this.publicHolidayStore.message());
      if (this.publicHolidayStore.error()) this.handleError(this.publicHolidayStore.message());
    });
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined))
  ));

  public publicHoliday = computed(() => {
    if (this.idParam()) {
      const publicHoliday = this.publicHolidayStore.getEntityById(this.idParam()!);
      this.publicHolidayId = publicHoliday.id;

      return PublicHolidayMapper.toPublicHolidayRequest(publicHoliday);
    } else {
      return EntitiesUtility.getEmptyPublicHolidayRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.idParam()) {
      this.publicHolidayStore.editEntity({ id: this.publicHolidayId, entity: this.publicHoliday() });
    } else {
      this.publicHolidayStore.addEntity(this.publicHoliday());
    }
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['public-holidays', 'dashboard']);
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

}
