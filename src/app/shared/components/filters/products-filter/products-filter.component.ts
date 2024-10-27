import { Component, computed, inject, input, output } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, MenuController, IonLabel, IonRange } from "@ionic/angular/standalone";
import { ProviderService } from 'src/app/core/services/provider.service';
import { FormsModule } from '@angular/forms';
import { SelectInputComponent } from "../../form/select-input/select-input.component";
import { ProductResponse } from 'src/app/core/models/interfaces/product.model';
import { CurrencyPipe } from '@angular/common';
import { Filter } from '../providers-filter/providers-filter.component';

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  standalone: true,
  imports: [IonRange, IonLabel, IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, FormsModule, SelectInputComponent, CurrencyPipe]
})
export class ProductsFilterComponent {
  // Dependencias e inyección
  private categoryService = inject(CategoryService);
  private providerService = inject(ProviderService);
  private menuController = inject(MenuController);

  // Inicialización de variables
  public categories = this.categoryService.categories;
  public providers = this.providerService.providers;
  public products = input<ProductResponse[]>();

  public lowestPrice = computed(() => (this.products() && this.products()!.length > 0) ? this.getLowestPrice(this.products()!) : 299);
  public highestPrice = computed(() => (this.products() && this.products()!.length > 0) ? this.getHigestPrice(this.products()!) : 9999);
  public priceRange: { lower: number, upper: number } = { lower: this.lowestPrice(), upper: this.highestPrice() };

  public filtersEmitter = output<Filter[]>();
  public filters: Filter[] = [
    { type: 'categories', value: [] },
    { type: 'providers', value: [] },
    { type: 'prices', value: [this.priceRange.lower, this.priceRange.upper] }
  ];

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' };

  // Método para aplicar el filtro
  public filterProviders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-menu');
  }

  // Método para limpiar los filtros
  public clearFilter() {
    this.filters = [
      { type: 'categories', value: [] },
      { type: 'providers', value: [] },
      { type: 'prices', value: [] }
    ];
    this.priceRange = { lower: this.lowestPrice(), upper: this.highestPrice() };

    this.filtersEmitter.emit(this.filters);
  }

  // Método para manejar cambios en el rango de precios
  public onPriceRangeChange() {
    this.filters[2].value = [this.priceRange.lower, this.priceRange.upper];
  }

  // Métodos para obtener el precio mínimo y máximo de los productos
  private getLowestPrice(products: ProductResponse[]): number {
    return Math.min(...products.map(product => Number(product.price)));
  }

  private getHigestPrice(products: ProductResponse[]): number {
    return Math.max(...products.map(product => Number(product.price)));
  }
}
