import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, IonButton, IonContent, IonList, MenuController } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CategoryModalComponent } from 'src/app/modules/categories/components/category-modal/category-modal.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { MAX_PRICE, MIN_PRICE, ProductFilters, ProductFilterComponent } from 'src/app/modules/products/components/product-dashboard/product-filter/product-filter.component';
import { DeletedButtonComponent } from 'src/app/shared/components/deleted-button/deleted-button.component';
import { ProductStore } from '../../store/product.store';
import { watchState } from '@ngrx/signals';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
  imports: [IonList, IonContent, IonButton, IonSearchbar, HeaderComponent, CategoryModalComponent, NotFoundComponent, ProductItemComponent, ProductFilterComponent, DeletedButtonComponent],
  standalone: true
})
export class ProductDashboardComponent {

  private alertService = inject(AlertService);
  private productStore = inject(ProductStore);
  private menuController = inject(MenuController)
  public router = inject(Router);

  public seeDeleted = signal(false);
  private searchQuery = signal('');
  private filters = signal<ProductFilters>({
    categories: [],
    providers: [],
    prices: [MIN_PRICE, MAX_PRICE]
  });

  public products = computed(() => {
    const products = this.filterProducts(this.filters(), this.seeDeleted());

    return products.filter(product => product.title.toLowerCase().includes(this.searchQuery()));
  });

  constructor() {
    watchState(this.productStore, () => {
      if (this.productStore.success()) this.alertService.getSuccessToast(this.productStore.message());
      if (this.productStore.error()) this.alertService.getErrorAlert(this.productStore.message());
    });
  }

  public searchForProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public openFilterMenu() {
    this.menuController.open("filter-product-menu");
  }

  public receiveFilters(filters: ProductFilters) {
    this.filters.set({ ...filters });
  }

  private filterProducts(filters: ProductFilters, seeDeleted: boolean) {
    let filteredProducts = seeDeleted ? this.productStore.deletedEntities() : this.productStore.enabledEntities();

    filteredProducts = filteredProducts.filter(product =>
      (filters.categories.length === 0 || filters.categories.includes(product.category.id)) &&
      (filters.providers.length === 0 || filters.providers.includes(product.provider.id)) &&
      (filters.prices.length === 0 || (Number(product.price) > filters.prices[0] && Number(product.price) < filters.prices[1]))
    );
    return filteredProducts;
  }

}
