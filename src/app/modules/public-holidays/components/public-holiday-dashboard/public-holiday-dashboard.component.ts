import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSearchbar, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { Router } from '@angular/router';
import { PublicHolidayItemComponent } from "./public-holiday-item/public-holiday-item.component";
import { PublicHolidayStore } from '../../store/public-holidays.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-public-holiday-dashboard',
  templateUrl: './public-holiday-dashboard.component.html',
  styleUrls: ['./public-holiday-dashboard.component.scss'],
  imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, PublicHolidayItemComponent],
  standalone: true
})
export class PublicHolidayDashboardComponent {

  private alertService = inject(AlertService);
  private publicHolidayStore = inject(PublicHolidayStore);
  public router = inject(Router);

  private searchQuery = signal('');

  public publicHolidays = computed(() => {
    return this.publicHolidayStore.enabledEntities().filter(publicHoliday => publicHoliday.reason.toLowerCase().includes(this.searchQuery()));
  });

  constructor() {
    watchState(this.publicHolidayStore, () => {
      if (this.publicHolidayStore.success()) this.alertService.getSuccessToast(this.publicHolidayStore.message());
      if (this.publicHolidayStore.error()) this.alertService.getErrorAlert(this.publicHolidayStore.message());
    });
  }

  public searchForPublicHolidays(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
