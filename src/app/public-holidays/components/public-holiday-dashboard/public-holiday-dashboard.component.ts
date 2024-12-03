import { Component, computed, inject, Signal, signal } from '@angular/core';
import { PublicHolidayResponse } from '../../models/public-holiday.model';
import { PublicHolidayService } from '../../services/public-holiday.service';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { IonContent, IonSearchbar, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/shared/components/not-found/not-found.component';
import { Router } from '@angular/router';
import { PublicHolidayItemComponent } from "./public-holiday-item/public-holiday-item.component";

@Component({
    selector: 'app-public-holiday-dashboard',
    templateUrl: './public-holiday-dashboard.component.html',
    styleUrls: ['./public-holiday-dashboard.component.scss'],
    imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, PublicHolidayItemComponent],
standalone: true
})
export class PublicHolidayDashboardComponent {

  public router = inject(Router);

  private publicHolidayService = inject(PublicHolidayService);

  private searchQuery = signal<string>('');
  private publicHolidays = this.publicHolidayService.publicHolidays;

  public searchBarResult: Signal<PublicHolidayResponse[]> = computed(() => this.publicHolidays().filter(publicHoliday => publicHoliday.reason.toLowerCase().indexOf(this.searchQuery()) > -1));

  public searchForPublicHolidays(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
