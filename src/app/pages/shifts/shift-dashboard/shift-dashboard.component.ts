import { Component, computed, inject, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ShiftResponse } from 'src/app/core/models/interfaces/shift.model';
import { ShiftService } from 'src/app/core/services/shift.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList } from "@ionic/angular/standalone";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { UserItemComponent } from "../../users/user-dashboard/user-item/user-item.component";
import { ShiftItemComponent } from "./shift-item/shift-item.component";

@Component({
  selector: 'app-shift-dashboard',
  templateUrl: './shift-dashboard.component.html',
  styleUrls: ['./shift-dashboard.component.scss'],
  standalone: true,
  imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, UserItemComponent, ShiftItemComponent]
})
export class ShiftDashboardComponent {

  public router = inject(Router);

  private shiftService = inject(ShiftService);

  private searchQuery = signal<string>('');
  private shifts = this.shiftService.shifts;

  public searchBarResult: Signal<ShiftResponse[]> = computed(() => this.shifts().filter(shift => shift.name.toLowerCase().indexOf(this.searchQuery()) > -1));

  public searchForShifts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
