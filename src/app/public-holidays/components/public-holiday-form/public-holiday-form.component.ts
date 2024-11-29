import { Component, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { PublicHolidayRequest } from '../../models/public-holiday.model';
import { PublicHolidayMapper } from 'src/shared/mappers/public-holiday.mapper';
import { EntitiesUtility } from 'src/shared/utils/entities.utility';
import { PublicHolidayService } from '../../services/public-holiday.service';
import { AlertService } from 'src/shared/services/alert.service';
import { ValidationService } from 'src/shared/services/validation.service';
import { TextInputComponent } from 'src/shared/components/form/text-input/text-input.component';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { WheelDateInputComponent } from 'src/shared/components/form/wheel-date-input/wheel-date-input.component';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { FormsModule } from '@angular/forms';
import { SelectInputComponent } from 'src/shared/components/form/select-input/select-input.component';
import { ShiftService } from 'src/app/shifts/services/shift.service';

@Component({
    selector: 'app-public-holiday-form',
    templateUrl: './public-holiday-form.component.html',
    styleUrls: ['./public-holiday-form.component.scss'],
    imports: [IonContent, HeaderComponent, TextInputComponent, WheelDateInputComponent, SubmitButtonComponent, FormsModule, SelectInputComponent, IonSelectOption]
})
export class PublicHolidayFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private publicHolidayService = inject(PublicHolidayService);
  private shiftService = inject(ShiftService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);

  public shifts = this.shiftService.shifts;

  public isPublicHolidayEdit!: boolean;
  private publicHolidayId!: number;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent>;

  public publicHoliday: Signal<PublicHolidayRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const publicHolidayId = params!.get('id');
      if (this.isParameterValid(publicHolidayId)) {
        const publicHoliday = this.publicHolidayService.getPublicHolidayById(Number(publicHolidayId));
        if (!publicHoliday) this.router.navigate(['providers', 'dashboard']);
        this.isPublicHolidayEdit = true;
        this.publicHolidayId = publicHoliday.id;
        return of(PublicHolidayMapper.toPublicHolidayRequest(publicHoliday));
      } else {
        this.isPublicHolidayEdit = false;
        return of(EntitiesUtility.getEmptyPublicHolidayRequest());
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
    return this.isPublicHolidayEdit
      ? this.publicHolidayService.editPublicHoliday(this.publicHolidayId, this.publicHoliday()!)
      : this.publicHolidayService.createPublicHoliday(this.publicHoliday()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['public-holidays', 'dashboard']);
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
