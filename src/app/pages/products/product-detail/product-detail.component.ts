import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { IonContent, IonCardHeader, IonCard, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonCardHeader, IonContent, BackButtonComponent, NotFoundComponent]
})
export class ProductDetailComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);

  public product = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('id'))) {
        const product = this.productService.getProductById(Number(params.get('id')));
        if (!product) this.router.navigate(['products', 'dashboard']);
        return of(product);
      }
      return of(null);
    })
  ));

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
