import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { IonContent, MenuController, IonButton } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { ProviderService } from 'src/app/modules/providers/services/provider.service';
import { IonSelectOption } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/modules/products/services/product.service';
import { UpperCasePipe } from '@angular/common';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { FormsModule } from '@angular/forms';
import { catchError, Observable, of, tap } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { ProductWithPricing } from 'src/app/modules/products/models/product.model';
import { ProductMapper } from 'src/app/shared/mappers/product.mapper';
import { FormButtonComponent } from 'src/app/shared/components/form/form-button/form-button.component';
import { ProviderPercentagesComponent } from "./provider-percentages/provider-percentages.component";
import { ProductPercentagesComponent } from "./product-percentages/product-percentages.component";
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';

@Component({
    selector: 'app-pricing-products',
    templateUrl: './pricing-products.component.html',
    styleUrls: ['./pricing-products.component.scss'],
    imports: [IonButton, IonContent, HeaderComponent, SelectInputComponent, IonSelectOption, UpperCasePipe, NumberInputComponent, FormsModule, NotFoundComponent, FormButtonComponent, ProviderPercentagesComponent, ProductPercentagesComponent],
standalone: true
})
export class PricingProductsComponent {

  private productService = inject(ProductService);
  private providerStore = inject(ProviderStore);
  private alertService = inject(AlertService);

  private destroyRef = inject(DestroyRef);
  private menuController = inject(MenuController)

  public providers = computed(() => this.providerStore.entities().filter(provider => provider.id! > 2));

  public selectedProviderId = signal<number>(0);

  public provider = computed(() => this.selectedProviderId() ? this.providerStore.getEntityById(this.selectedProviderId()) : null);
  public selectedProduct: ProductWithPricing | null = null;

  public products = computed(() => signal(this.productService.getProductsByProvider(this.selectedProviderId()!).filter(product => product.isEnabled)));
  public productsWithPricing = computed(() => signal(this.getProductsWithPricing()));

  public openProviderPercentagesMenu() {
    if (this.selectedProviderId() !== 0) this.menuController.open("provider-percentages-menu");
  }

  public openProductPercentagesMenu(product: ProductWithPricing) {
    this.menuController.open("product-percentages-menu" + product.id);
  }

  public areSubmitButtonsValid() {
    return (this.selectedProviderId() ? true:false) && this.productsWithPricing()().some(product => product.subtotal > 0 && product.quantity > 0);
  }

  private getProductsWithPricing(): ProductWithPricing[] {
    return this.products()().map(product => ProductMapper.toProductWithPricing(product));
  }

  public receiveProductPercentages(product: ProductWithPricing | null | undefined) {
    const productsWithPricing = this.productsWithPricing()().map(productWithPricing => productWithPricing.id === product!.id ? product : productWithPricing);
    console.log(productsWithPricing);
    this.productsWithPricing().set(productsWithPricing as ProductWithPricing[]);
  }

  public onCalculateSubmit() {
    const modifiedProductsWithPricing = this.productsWithPricing()().map(product => {
      if (product.subtotal > 0 && product.quantity > 0) {
        const productBasePrice = (product.subtotal / product.quantity);
        const productProfit = productBasePrice * (product.profitPercentage / 100);
        const productVat = productBasePrice * (product.vatPercentage / 100);
  
        const productNewPrice = productBasePrice + productProfit + productVat;
        return {
          ...product,
          price: productNewPrice.toFixed(2)
        }
      } else {
        return product
      }
    });

    this.productsWithPricing().set(modifiedProductsWithPricing);
    this.alertService.getSuccessToast('Precios calculados correctamente');
  }

  public onApplySubmit() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas continuar?', 'Se modificarán los precios de los productos calculados', 'APLICAR')
    
    .then((result: any) => { if (result.isConfirmed) this.applyNewPrices(); });
  }

  private applyNewPrices() {
    const modifiedProducts = this.productsWithPricing()().map(productWithPricing => ProductMapper.toProductResponse(productWithPricing));
    this.products().set(modifiedProducts);

    this.productService.editProductsPrice(this.products()()).pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private handleSuccess(response: string): void {
    this.alertService.getSuccessToast(response);
    this.productsWithPricing().set(this.getProductsWithPricing());
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
    return of(null);
  }

}