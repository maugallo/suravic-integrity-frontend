import { Component, inject, input } from '@angular/core';
import { ProductResponse } from 'src/app/modules/products/models/product.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { ProductStore } from '../../../store/product.store';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class ProductItemComponent {

  private productStore = inject(ProductStore);
  private alertService = inject(AlertService);
  public router = inject(Router);

  public product: any = input<ProductResponse>();

  public openDeleteOrRecoverProductAlert() {
    const action = this.product().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.product().isEnabled ? 'ELIMINAR' : 'ACEPTAR';

    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el producto?`, '', confirmLabel)
      .then((result: any) => {
        if (result.isConfirmed)
          this.productStore.deleteEntity(this.product().id);
      });
  }

}
