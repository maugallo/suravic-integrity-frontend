import { Component, computed, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonMenu, IonSelectOption, IonButton, MenuController } from "@ionic/angular/standalone";
import { VAT_CONDITIONS } from 'src/app/modules/providers/models/provider-selects.constant';
import { SectorStore } from 'src/app/modules/sectors/stores/sector.store';
import { SelectInputComponent } from "../../../../../shared/components/form/select-input/select-input.component";

@Component({
  selector: 'app-provider-filter',
  templateUrl: './provider-filter.component.html',
  styleUrls: ['./provider-filter.component.scss'],
  imports: [IonButton, IonContent, IonMenu, IonSelectOption, FormsModule, SelectInputComponent],
  standalone: true
})
export class ProviderFilterComponent {

  private sectorStore = inject(SectorStore);
  private menuController = inject(MenuController);

  public filtersEmitter = output<ProviderFilters>();

  public sectors = computed(() => this.sectorStore.enabledEntities());
  public vatConditions = VAT_CONDITIONS;

  public filters: ProviderFilters = {
    sectors: [],
    vatConditions: []
  }

  public filterProviders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-provider-menu');
  }

  public clearFilter() {
    this.filters = {
      sectors: [],
      vatConditions: []
    }

    this.filtersEmitter.emit(this.filters);
  }

}

export interface ProviderFilters {
  sectors: number[],
  vatConditions: string[]
}