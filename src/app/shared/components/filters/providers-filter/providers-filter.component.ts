import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, MenuController } from "@ionic/angular/standalone";
import { VAT_CONDITIONS } from 'src/app/modules/providers/models/provider-selects.constant';
import { SectorService } from 'src/app/modules/sectors/services/sector.service';
import { SectorStore } from 'src/app/modules/sectors/stores/sector.store';
import { Filter } from 'src/app/shared/models/filter.model';

@Component({
    selector: 'app-providers-filter',
    templateUrl: './providers-filter.component.html',
    styleUrls: ['./providers-filter.component.scss'],
    imports: [IonButton, IonContent, IonMenu, IonSelect, IonSelectOption, FormsModule],
standalone: true
})
export class ProvidersFilterComponent {

  private sectorStore = inject(SectorStore);
  private menuController = inject(MenuController);

  public sectors = this.sectorStore.entities();
  public vatConditions = VAT_CONDITIONS;

  public filtersEmitter = output<Filter[]>();
  public filters: Filter[] = [
    { type: 'sectors', value: [] },
    { type: 'vat conditions', value: [] }
  ];
  
  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public filterProviders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-menu');
  }

  public clearFilter() {
    this.filters = [
      { type: 'sectors', value: [] },
      { type: 'vat conditions', value: [] }
    ];

    this.filtersEmitter.emit(this.filters);
  }

}