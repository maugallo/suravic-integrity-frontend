import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonInput, IonText, IonAccordion, IonItem, IonLabel, IonAccordionGroup } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { WEIGHT_AVERAGES } from 'src/app/core/constants/weight-average.constant';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-pricing-meat',
  templateUrl: './pricing-meat.component.html',
  styleUrls: ['./pricing-meat.component.scss'],
  standalone: true,
  imports: [IonAccordionGroup, IonLabel, IonItem, IonAccordion, IonText, IonInput, IonContent, HeaderComponent, FormsModule, NotFoundComponent, UpperCasePipe]
})
export class PricingMeatComponent implements OnInit {

  private productsService = inject(ProductService);

  public products = this.productsService.getProductsByCategory('carnes');
  public weightAverages = WEIGHT_AVERAGES;  

  public mediaResCost = '';

  ngOnInit(): void {
    console.log(this.products());
  }

}
