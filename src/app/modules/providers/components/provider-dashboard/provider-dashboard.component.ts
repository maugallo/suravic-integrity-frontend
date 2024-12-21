import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSearchbar, IonButton, IonList, MenuController } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { ProviderItemComponent } from './provider-item/provider-item.component';
import { ProvidersFilterComponent } from 'src/app/shared/components/filters/providers-filter/providers-filter.component';
import { SectorModalComponent } from 'src/app/modules/sectors/components/sector-modal/sector-modal.component';
import { DeletedButtonComponent } from 'src/app/shared/components/deleted-button/deleted-button.component';
import { Filter } from 'src/app/shared/models/filter.model';
import { ProviderStore } from '../../stores/provider.store';
import { watchState } from '@ngrx/signals';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorModalComponent, NotFoundComponent, ProviderItemComponent, ProvidersFilterComponent, DeletedButtonComponent],
  standalone: true
})
export class ProviderDashboardComponent {

  private alertService = inject(AlertService);
  private providerStore = inject(ProviderStore);
  private menuController = inject(MenuController);
  public router = inject(Router);

  private searchQuery = signal('');
  private filters = signal<Filter[]>([]);

  public filteredProviders = computed(() => {
    const providers = this.filterProviders(this.filters(), this.seeDeleted());

    return providers.filter(provider => provider.companyName.toLowerCase().includes(this.searchQuery()));
  });

  public seeDeleted = signal(false);

  constructor() {
    watchState(this.providerStore, () => {
      if (this.providerStore.success()) this.alertService.getSuccessToast(this.providerStore.message());
      if (this.providerStore.error()) this.alertService.getErrorAlert(this.providerStore.message());
    });
  }

  public searchForProviders(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public openFilterMenu() {
    this.menuController.open("filter-menu");
  }

  public receiveFilters(filters: any) {
    this.filters.set([...filters]);
  }

  private filterProviders(filters: Filter[], seeDeleted: boolean) {
    let filteredProviders = seeDeleted ? this.providerStore.deletedEntities() : this.providerStore.enabledEntities();

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
