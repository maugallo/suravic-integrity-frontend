import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PublicHolidayResponse } from 'src/app/modules/public-holidays/models/public-holiday.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';
import { PublicHolidayStore } from '../../../store/public-holidays.store';

@Component({
  selector: 'app-public-holiday-item',
  templateUrl: './public-holiday-item.component.html',
  styleUrls: ['./public-holiday-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, DatePipe],
  standalone: true
})
export class PublicHolidayItemComponent {

  private publicHolidayStore = inject(PublicHolidayStore);
  private alertService = inject(AlertService);
  public router = inject(Router);

  public publicHoliday: any = input<PublicHolidayResponse>();

  public openDeletePublicHolidayAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar el feriado?`, 'Esta acción no se puede deshacer')
      .then((result: any) => {
        if (result.isConfirmed)
          this.publicHolidayStore.deleteEntity(this.publicHoliday().id);
      });
  }

}
