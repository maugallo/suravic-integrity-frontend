import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { IonContent, IonCardHeader, IonCard, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { CurrencyPipe } from '@angular/common';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [IonCardContent, IonCard, IonCardHeader, IonContent, BackButtonComponent, CurrencyPipe],
  standalone: true
})
export class ProductDetailComponent {

  private activatedRoute = inject(ActivatedRoute);
  private productStore = inject(ProductStore);

  public product = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')))),
    switchMap((productId) => of(this.productStore.getEntityById(productId)))
  ));

}
