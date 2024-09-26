import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, MenuController } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { SectorModalComponent } from './sector-modal/sector-modal.component';
import { ProviderService } from 'src/app/core/services/provider.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ProviderItemComponent } from "./provider-item/provider-item.component";
import { Filter, FilterComponent } from "../../../shared/components/filter/filter.component";
import { ProviderResponse } from 'src/app/core/models/provider.model';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorModalComponent, NotFoundComponent, ProviderItemComponent, FilterComponent]
})
export class ProviderDashboardComponent implements OnInit {

  public router = inject(Router);
  private providerService = inject(ProviderService);
  private menuController = inject(MenuController);

  private providers = this.providerService.providers;
  private searchQuery = signal('');
  private filters: WritableSignal<Filter[]> = signal([]);

  public filteredProviders = computed(() => {
    const providers = this.filterProviders(this.providers(), this.filters());

    return providers.filter(provider => provider.companyName.toLowerCase().includes(this.searchQuery()));
  });

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
    this.providerService.refreshProviders();
  }

  public openFilterMenu() {
    this.menuController.open("filter-menu");
  }

  public receiveFilters(filters: any) {
    this.filters.set([...filters]);
    /* IMPORTANTE: Angular compara la referencia del array y,
    al no cambiar la referencia del array en sí
    (solo sus elementos internos), no dispara la reactividad.
    Por eso tenemos que asignar un array completamente nuevo,
    pisando el anterior. */
  }

  private filterProviders(providers: ProviderResponse[], filters: Filter[]) {
    if (filters.length > 0) {
      const sectorsFilter = filters[0].value;
      const vatConditionsFilter = filters[1].value;

      return providers.filter(provider =>
        (sectorsFilter.length === 0 || sectorsFilter.includes(provider.sector.id)) &&
        (vatConditionsFilter.length === 0 || vatConditionsFilter.includes(provider.vatCondition)))
    }
    return providers;
  }

}
