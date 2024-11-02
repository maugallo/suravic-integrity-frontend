import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DayOffService } from 'src/app/core/services/day-off.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSearchbar, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { DayOffItemComponent } from "./day-off-item/day-off-item.component";

@Component({
  selector: 'app-day-off-dashboard',
  templateUrl: './day-off-dashboard.component.html',
  styleUrls: ['./day-off-dashboard.component.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, DayOffItemComponent]
})
export class DayOffDashboardComponent {

  public router = inject(Router);

  private dayOffService = inject(DayOffService);

  public daysOff = this.dayOffService.daysOff;

}
