import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { IonButton, IonList, IonProgressBar, IonAlert } from "@ionic/angular/standalone";
import { SectorService } from 'src/app/core/services/sector.service';
import { AsyncPipe } from '@angular/common';
import { NotFoundComponent } from "../../../../shared/components/not-found/not-found.component";
import { Observable } from 'rxjs';
import { SectorResponse } from 'src/app/core/models/sector.model';

@Component({
  selector: 'app-sector-dashboard',
  templateUrl: './sector-dashboard.component.html',
  styleUrls: ['./sector-dashboard.component.scss'],
  standalone: true,
  imports: [IonAlert, IonProgressBar, IonList, IonButton, HeaderComponent, AsyncPipe, NotFoundComponent]
})
export class SectorDashboardComponent {

  private sectorService = inject(SectorService);

  sectors$: Observable<SectorResponse[]> = this.sectorService.getSectors(true);

}
