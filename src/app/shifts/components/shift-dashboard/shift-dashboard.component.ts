import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShiftService } from 'src/app/core/services/shift.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ShiftItemComponent } from "./shift-item/shift-item.component";

@Component({
    selector: 'app-shift-dashboard',
    templateUrl: './shift-dashboard.component.html',
    styleUrls: ['./shift-dashboard.component.scss'],
    imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, ShiftItemComponent]
})
export class ShiftDashboardComponent {

  public router = inject(Router);

  private shiftService = inject(ShiftService);

  public shifts = this.shiftService.shifts;

}