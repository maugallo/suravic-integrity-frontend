import { Component, computed, inject, input, output } from '@angular/core';
import { CategoryService } from 'src/app/modules/categories/services/category.service';
import { IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, MenuController, IonLabel, IonRange } from "@ionic/angular/standalone";
import { ProviderService } from 'src/app/modules/providers/services/provider.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Filter } from 'src/app/shared/models/filter.model';
import { ProductResponse } from 'src/app/modules/products/models/product.model';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';

@Component({
    selector: 'app-products-filter',
    templateUrl: './products-filter.component.html',
    styleUrls: ['./products-filter.component.scss'],
    imports: [IonRange, IonLabel, IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, FormsModule, CurrencyPipe],
standalone: true
})
export class ProductsFilterComponent {
  private categoryService = inject(CategoryService);
  private providerStore = inject(ProviderStore);

  private menuController = inject(MenuController);

  public categories = this.categoryService.categories;
  public providers = this.providerStore.entities();
  public products = input<ProductResponse[]>();

  public lowestPrice = computed(() => (this.products() && this.products()!.length > 0) ? this.getLowestPrice(this.products()!) : 0);
  public highestPrice = computed(() => (this.products() && this.products()!.length > 0) ? this.getHigestPrice(this.products()!) : 99999);
  public priceRange: { lower: number, upper: number } = { lower: this.lowestPrice(), upper: this.highestPrice() };

  public filtersEmitter = output<Filter[]>();
  public filters: Filter[] = [
    { type: 'categories', value: [] },
    { type: 'providers', value: [] },
    { type: 'prices', value: [this.priceRange.lower, this.priceRange.upper] }
  ];

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' };

  public filterProviders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-menu');
  }

  public clearFilter() {
    this.filters = [
      { type: 'categories', value: [] },
      { type: 'providers', value: [] },
      { type: 'prices', value: [] }
    ];
    this.priceRange = { lower: this.lowestPrice(), upper: this.highestPrice() };

    this.filtersEmitter.emit(this.filters);
  }

  public onPriceRangeChange() {
    this.filters[2].value = [this.priceRange.lower, this.priceRange.upper];
  }

  private getLowestPrice(products: ProductResponse[]): number {
    return Math.min(...products.map(product => Number(product.price)));
  }

  private getHigestPrice(products: ProductResponse[]): number {
    return Math.max(...products.map(product => Number(product.price)));
  }
}
