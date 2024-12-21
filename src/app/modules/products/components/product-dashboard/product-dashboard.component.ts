import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { IonSearchbar, IonButton, IonContent, IonList, MenuController } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CategoryModalComponent } from 'src/app/modules/categories/components/category-modal/category-modal.component';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductResponse } from '../../models/product.model';
import { ProductsFilterComponent } from 'src/app/shared/components/filters/products-filter/products-filter.component';
import { DeletedButtonComponent } from 'src/app/shared/components/deleted-button/deleted-button.component';
import { Filter } from 'src/app/shared/models/filter.model';

@Component({
    selector: 'app-product-dashboard',
    templateUrl: './product-dashboard.component.html',
    styleUrls: ['./product-dashboard.component.scss'],
    imports: [IonList, IonContent, IonButton, IonSearchbar, HeaderComponent, CategoryModalComponent, NotFoundComponent, ProductItemComponent, ProductsFilterComponent, DeletedButtonComponent],
standalone: true
})
export class ProductDashboardComponent {

  public router = inject(Router);
  private menuController = inject(MenuController)

  private productService = inject(ProductService);

  public products = this.productService.products;
  private searchQuery = signal<string>('');
  private filters = signal<Filter[]>([]);

  public filteredProducts = computed(() => {
    const products = this.filterProducts(this.products(), this.filters(), this.seeDeleted());

    return products.filter(product => product.title.toLowerCase().includes(this.searchQuery()));
  });

  public seeDeleted = signal(false);
  
  public searchForProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public openFilterMenu() {
    this.menuController.open("filter-menu");
  }

  public receiveFilters(filters: any) {
    this.filters.set([...filters]);
  }

  private filterProducts(products: ProductResponse[], filters: Filter[], seeDeleted: boolean) {
    let filteredProducts = products.filter(product => product.isEnabled !== seeDeleted);

    if (filters.length > 0) {
      const categoriesFilter = filters[0].value;
      const providersFilter = filters[1].value;
      const pricesFilter = filters[2].value;

      return filteredProducts.filter(product =>
        (categoriesFilter.length === 0 || categoriesFilter.includes(product.category.id)) &&
        (providersFilter.length === 0 || providersFilter.includes(product.provider.id)) &&
        (pricesFilter.length === 0 || (Number(product.price) > pricesFilter[0] && Number(product.price) < pricesFilter[1]))
      );
    }
    return filteredProducts;
  }

}
