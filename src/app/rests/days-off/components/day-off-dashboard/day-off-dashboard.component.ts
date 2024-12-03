import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DayOffService } from '../../services/day-off.service';
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/shared/components/not-found/not-found.component';
import { DayOffItemComponent } from "./day-off-item/day-off-item.component";

@Component({
    selector: 'app-day-off-dashboard',
    templateUrl: './day-off-dashboard.component.html',
    styleUrls: ['./day-off-dashboard.component.scss'],
    imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, DayOffItemComponent],
standalone: true
})
export class DayOffDashboardComponent {

  public router = inject(Router);

  private dayOffService = inject(DayOffService);

  public daysOff = this.dayOffService.daysOff;

}
