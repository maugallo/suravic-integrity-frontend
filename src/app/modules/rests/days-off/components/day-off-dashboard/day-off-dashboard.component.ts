import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { DayOffItemComponent } from "./day-off-item/day-off-item.component";
import { DayOffStore } from '../../store/days-off.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-day-off-dashboard',
  templateUrl: './day-off-dashboard.component.html',
  styleUrls: ['./day-off-dashboard.component.scss'],
  imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, DayOffItemComponent],
  standalone: true
})
export class DayOffDashboardComponent {

  private alertService = inject(AlertService);
  private dayOffStore = inject(DayOffStore);
  public router = inject(Router);

  public daysOff = computed(() => this.dayOffStore.enabledEntities());

  constructor() {
    watchState(this.dayOffStore, () => {
      if (this.dayOffStore.success()) this.alertService.getSuccessToast(this.dayOffStore.message());
      if (this.dayOffStore.error()) this.alertService.getErrorAlert(this.dayOffStore.message());
    });
  }

}
