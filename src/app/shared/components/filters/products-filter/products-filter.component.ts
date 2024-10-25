import { Component, inject, output } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, MenuController } from "@ionic/angular/standalone";
import { ProviderService } from 'src/app/core/services/provider.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  standalone: true,
  imports: [IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, FormsModule]
})
export class ProductsFilterComponent {

  private categoryService = inject(CategoryService);
  private providerService = inject(ProviderService);
  private menuController = inject(MenuController);

  public categories = this.categoryService.categories;
  public providers = this.providerService.providers;

  public filtersEmitter = output<Filter[]>();
  public filters: Filter[] = [
    { type: 'categories', value: [] },
    { type: 'providers', value: [] }
  ];
  
  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public filterProviders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-menu');
  }

  public clearFilter() {
    this.filters = [
      { type: 'categories', value: [] },
      { type: 'providers', value: [] }
    ];

    this.filtersEmitter.emit(this.filters);
  }

}

export interface Filter {
  type: string,
  value: any[]
}
