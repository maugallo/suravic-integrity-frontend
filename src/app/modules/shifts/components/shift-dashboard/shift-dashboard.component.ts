import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { ShiftItemComponent } from "./shift-item/shift-item.component";
import { ShiftStore } from '../../store/shift.store';

@Component({
  selector: 'app-shift-dashboard',
  templateUrl: './shift-dashboard.component.html',
  styleUrls: ['./shift-dashboard.component.scss'],
  imports: [IonList, IonButton, IonContent, HeaderComponent, NotFoundComponent, ShiftItemComponent],
  standalone: true
})
export class ShiftDashboardComponent {

  private shiftStore = inject(ShiftStore);
  public router = inject(Router);

  public shifts = computed(() => this.shiftStore.enabledEntities());

}
