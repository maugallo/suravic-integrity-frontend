import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ProductResponse } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, ]
})
export class ProductItemComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);
  
  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  public product: any = input<ProductResponse>();

  public openDeleteProductAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el producto?')
      .fire()
      .then((result) => {if (result.isConfirmed) this.deleteProduct(this.product().id); });
  }

  private deleteProduct(id: number) {
    this.productService.deleteOrRecoverProduct(id).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
