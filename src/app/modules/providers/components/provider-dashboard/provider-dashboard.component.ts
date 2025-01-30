import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSearchbar, IonButton, IonList, MenuController } from "@ionic/angular/standalone";
import { NavigationEnd, Router } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { ProviderItemComponent } from './provider-item/provider-item.component';
import { ProviderFilters, ProviderFilterComponent } from 'src/app/modules/providers/components/provider-dashboard/provider-filter/provider-filter.component';
import { SectorModalComponent } from 'src/app/modules/sectors/components/sector-modal/sector-modal.component';
import { DeletedButtonComponent } from 'src/app/shared/components/deleted-button/deleted-button.component';
import { ProviderStore } from '../../stores/provider.store';
import { watchState } from '@ngrx/signals';
import { AlertService } from 'src/app/shared/services/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { StorageService, StorageType } from 'src/app/shared/services/storage.service';
import { TokenUtility } from 'src/app/shared/utils/token.utility';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss'],
  imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, SectorModalComponent, NotFoundComponent, ProviderItemComponent, ProviderFilterComponent, DeletedButtonComponent],
  standalone: true
})
export class ProviderDashboardComponent {

  private alertService = inject(AlertService);
  private storageService = inject(StorageService);
  private providerStore = inject(ProviderStore);
  private menuController = inject(MenuController);
  public router = inject(Router);

  public seeDeleted = signal(false);
  private searchQuery = signal('');
  private filters = signal<ProviderFilters>({
    sectors: [],
    vatConditions: []
  });

  public role = toSignal(this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() => this.storageService.getStorage(StorageType.TOKEN)),
    tap((token) => token ?? this.router.navigate(['welcome'])),
    map((token) => TokenUtility.getRoleFromToken(token))
  ));

  public providers = computed(() => {
    const providers = this.filterProviders(this.filters(), this.seeDeleted());

    return providers.filter(provider => provider.companyName.toLowerCase().includes(this.searchQuery()));
  });

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
    this.menuController.open("filter-provider-menu");
  }

  public receiveFilters(filters: ProviderFilters) {
    this.filters.set({ ...filters });
  }

  private filterProviders(filters: ProviderFilters, seeDeleted: boolean) {
    let filteredProviders = seeDeleted ? this.providerStore.deletedEntities() : this.providerStore.enabledEntities();

    filteredProviders = filteredProviders.filter(provider =>
      (filters.sectors.length === 0 || filters.sectors.includes(provider.sector.id)) &&
      (filters.vatConditions.length === 0 || filters.vatConditions.includes(provider.vatCondition))
    );
    return filteredProviders;
  }

}
