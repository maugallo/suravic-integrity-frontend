import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, IonModal, IonHeader, IonButtons, IonToolbar, IonTitle, IonItem, IonInput } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { SectorModalComponent } from './sector-modal/sector-modal.component';
import { map, Observable, shareReplay } from 'rxjs';
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
export class ProviderDashboardComponent implements OnInit {

  public router = inject(Router);
  private providerService = inject(ProviderService);

  private searchQuery: WritableSignal<string> = signal('');
  private providers$!: Observable<ProviderResponse[]>;
  public searchBarResult!: Signal<Observable<ProviderResponse[]>>;

  ngOnInit(): void {
    this.renderDashboard();
  }

  ionViewWillEnter() {
    this.renderDashboard();
  }

  public searchForProviders(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public renderDashboard() {
    this.providers$ = this.providerService.getProviders(true).pipe(
      shareReplay(1)
    );

    this.searchBarResult = computed(() => { // Computed detecta el cambio en otras signals.
      const query = this.searchQuery();
      return this.providers$.pipe(
        map(providers => providers.filter(provider => provider.companyName.toLowerCase().includes(query)))
      );
    });
  }

}
