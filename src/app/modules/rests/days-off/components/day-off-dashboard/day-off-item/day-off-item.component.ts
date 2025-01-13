import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DayOffResponse } from '../../../models/day-off.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { DatePipe } from '@angular/common';
import { DayOffStore } from '../../../store/days-off.store';

@Component({
  selector: 'app-day-off-item',
  templateUrl: './day-off-item.component.html',
  styleUrls: ['./day-off-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, DatePipe],
  standalone: true
})
export class DayOffItemComponent {

  private dayOffStore = inject(DayOffStore);
  private alertService = inject(AlertService);
  public router = inject(Router);

  public dayOff: any = input<DayOffResponse>();

  public openDeleteDayOffAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar el franco?`, 'Esta acción no se puede deshacer')
      .then((result: any) => {
        if (result.isConfirmed)
          this.dayOffStore.deleteEntity(this.dayOff().id);
      });
  }

}
