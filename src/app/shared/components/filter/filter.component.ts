import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, MenuController } from "@ionic/angular/standalone";
import { VAT_CONDITIONS } from 'src/app/core/constants/vat-conditions.constants';
import { SectorService } from 'src/app/core/services/sector.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonMenu, IonSelect, IonSelectOption, FormsModule]
})
export class FilterComponent {

  private sectorService = inject(SectorService);
  private menuController = inject(MenuController);

  public sectors = this.sectorService.sectors;
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

export interface Filter {
  type: string,
  value: any[]
}