import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, IonModal, IonHeader, IonButtons, IonToolbar, IonTitle, IonItem, IonInput } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { SectorModalComponent } from '../../sectors/sector-modal/sector-modal.component';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { ProviderService } from 'src/app/core/services/provider.service';
import { ProviderResponse } from 'src/app/core/models/provider.model';
import { AsyncPipe } from '@angular/common';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ProviderItemComponent } from "./provider-item/provider-item.component";

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonTitle, IonToolbar, IonButtons, IonHeader, IonModal, IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorModalComponent, AsyncPipe, NotFoundComponent, ProviderItemComponent]
})
export class ProviderDashboardComponent {

  public router = inject(Router);
  private providerService = inject(ProviderService);

  private searchQuery$ = new BehaviorSubject('');
  private providers$: Observable<ProviderResponse[]> = this.providerService.getProviders(true).pipe(
    tap((response) => console.log(response)),
    shareReplay(1)
  );
  public searchBarResult$: Observable<ProviderResponse[]> = combineLatest([this.providers$, this.searchQuery$]).pipe(
    map(([providers, query]) => {
      return providers.filter(provider => provider.companyName.toLowerCase().indexOf(query) > -1);
    })
  );

  ionViewWillEnter() {
    this.refreshDashboard();
  }

  public searchForProviders(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery$.next(query);
  }

  private refreshDashboard() {
    this.providers$ = this.providerService.getProviders(true).pipe(
      shareReplay(1)
    );
    this.searchBarResult$ = combineLatest([this.providers$, this.searchQuery$]).pipe(
      map(([providers, query]) => {
        return providers.filter(provider => provider.companyName.toLowerCase().indexOf(query) > -1);
      })
    );
  }

}
