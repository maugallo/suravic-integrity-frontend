import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, MenuController, IonToggle } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/core/services/provider.service';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ProviderItemComponent } from "./provider-item/provider-item.component";
import { ProvidersFilterComponent } from "../../../shared/components/filters/providers-filter/providers-filter.component";
import { ProviderResponse } from 'src/app/core/models/interfaces/provider.model';
import { SectorModalComponent } from './sector-modal/sector-modal.component';
import { DeletedButtonComponent } from "../../../shared/components/deleted-button/deleted-button.component";
import { Filter } from 'src/app/core/models/interfaces/filter.model';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  standalone: true,
  imports: [IonToggle, IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorModalComponent, NotFoundComponent, ProviderItemComponent, ProvidersFilterComponent, DeletedButtonComponent]
})
export class ProviderDashboardComponent {

  public router = inject(Router);
  private menuController = inject(MenuController);

  private providerService = inject(ProviderService);

  private providers = this.providerService.providers;
  private searchQuery = signal<string>('');
  private filters = signal<Filter[]>([]);

  public filteredProviders = computed(() => {
    const providers = this.filterProviders(this.providers(), this.filters(), this.seeDeleted());

    return providers.filter(provider => provider.companyName.toLowerCase().includes(this.searchQuery()));
  });

  public seeDeleted = signal(false);

  public searchForProviders(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
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

  private filterProviders(providers: ProviderResponse[], filters: Filter[], seeDeleted: boolean) {
    let filteredProviders = providers.filter(provider => provider.isEnabled !== seeDeleted);
  
    if (filters.length > 0) {
      const sectorsFilter = filters[0].value;
      const vatConditionsFilter = filters[1].value;
  
      filteredProviders = filteredProviders.filter(provider =>
        (sectorsFilter.length === 0 || sectorsFilter.includes(provider.sector.id)) &&
        (vatConditionsFilter.length === 0 || vatConditionsFilter.includes(provider.vatCondition))
      );
    }
    
    return filteredProviders;
  }

}
