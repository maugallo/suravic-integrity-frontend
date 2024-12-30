import { Component, computed, inject, output } from '@angular/core';
import { IonContent, IonMenu, IonSelectOption, IonButton, MenuController, IonLabel, IonRange } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';
import { CategoryStore } from 'src/app/modules/categories/stores/category.store';
import { SelectInputComponent } from "../../../../../shared/components/form/select-input/select-input.component";

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss'],
  imports: [IonRange, IonLabel, IonContent, IonMenu, IonSelectOption, IonButton, FormsModule, CurrencyPipe, SelectInputComponent],
  standalone: true
})
export class ProductFilterComponent {

  private categoryStore = inject(CategoryStore);
  private providerStore = inject(ProviderStore);
  private menuController = inject(MenuController);

  public filtersEmitter = output<ProductFilters>();

  public categories = computed(() => this.categoryStore.enabledEntities());
  public providers = computed(() => this.providerStore.enabledEntities());

  public MIN_PRICE = MIN_PRICE;
  public MAX_PRICE = MAX_PRICE;
  public priceRange = { lower: MIN_PRICE, upper: MAX_PRICE };

  public filters: ProductFilters = {
    categories: [],
    providers: [],
    prices: []
  }

  public filterProducts() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-product-menu');
  }

  public clearFilter() {
    this.filters = {
      categories: [],
      providers: [],
      prices: []
    }
    this.priceRange = { lower: MIN_PRICE, upper: MAX_PRICE };

    this.filtersEmitter.emit(this.filters);
  }

  public onPriceRangeChange() {
    this.filters.prices = [this.priceRange.lower, this.priceRange.upper];
  }

}

export const MIN_PRICE = 0;
export const MAX_PRICE = 30000;

export interface ProductFilters {
  categories: number[],
  providers: number[],
  prices: number[]
}
