import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonInput, IonText } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";

@Component({
  selector: 'app-pricing-meat',
  templateUrl: './pricing-meat.component.html',
  styleUrls: ['./pricing-meat.component.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonContent, HeaderComponent, FormsModule, NotFoundComponent]
})
export class PricingMeatComponent implements OnInit {

  private productsService = inject(ProductService);

  public products = this.productsService.getProductsByCategory('carnes');

  ngOnInit(): void {
    console.log(this.products());
  }

}
