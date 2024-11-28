import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductResponse } from 'src/app/core/models/interfaces/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
    selector: 'app-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.scss'],
    imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,]
})
export class ProductItemComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  public product: any = input<ProductResponse>();

  public openDeleteOrRecoverProductAlert() {
    const action = this.product().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.product().isEnabled ? 'ELIMINAR' : 'ACEPTAR';
    
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el producto?`, '', confirmLabel)
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteOrRecoverProduct(this.product().id) });
  }

  private deleteOrRecoverProduct(id: number) {
    this.productService.deleteOrRecoverProduct(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => console.log(error)
    });
  }

}
