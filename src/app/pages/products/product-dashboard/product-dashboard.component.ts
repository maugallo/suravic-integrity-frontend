import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { IonSearchbar, IonButton, IonContent, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { CategoryModalComponent } from "./category-modal/category-modal.component";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonList, IonContent, IonButton, IonSearchbar, HeaderComponent, CategoryModalComponent, NotFoundComponent, ProductItemComponent]
})
export class ProductDashboardComponent {

  public router = inject(Router);
  private productService = inject(ProductService);

  private searchQuery: WritableSignal<string> = signal('');
  private products = this.productService.products;

  public searchBarResult = computed(() => {
    return this.products().filter(product => product.title.toLowerCase().includes(this.searchQuery()));
  });

  public searchForProducts(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
