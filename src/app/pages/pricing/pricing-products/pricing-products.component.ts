import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { SelectInputComponent } from "../../../shared/components/form/select-input/select-input.component";
import { ProviderService } from 'src/app/core/services/provider.service';
import { IonSelectOption } from "@ionic/angular/standalone";
import { ProductService } from 'src/app/core/services/product.service';
import { UpperCasePipe } from '@angular/common';
import { NumberInputComponent } from "../../../shared/components/form/number-input/number-input.component";
import { SubmitButtonComponent } from "../../../shared/components/form/submit-button/submit-button.component";
import { FormsModule } from '@angular/forms';
import { catchError, Observable, of, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoryResponse } from 'src/app/core/models/interfaces/category.model';
import { ProviderResponse } from 'src/app/core/models/interfaces/provider.model';
import { UserResponse } from 'src/app/core/models/interfaces/user.model';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ProductWithPricing } from 'src/app/core/models/interfaces/product.model';

@Component({
  selector: 'app-pricing-products',
  templateUrl: './pricing-products.component.html',
  styleUrls: ['./pricing-products.component.scss'],
  standalone: true,
  imports: [IonContent, HeaderComponent, SelectInputComponent, IonSelectOption, UpperCasePipe, NumberInputComponent, SubmitButtonComponent, FormsModule, NotFoundComponent]
})
export class PricingProductsComponent {

  private providerService = inject(ProviderService);
  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  private destroyRef = inject(DestroyRef);
  public providers = computed(() => this.providerService.providers().filter(provider => provider.id > 2));

  public selectedProviderId = signal<number>(0);

  public provider = computed(() => this.selectedProviderId() ? this.providerService.getProviderById(this.selectedProviderId()!) : null);
  public products = computed(() => signal(this.productService.getProductsByProvider(this.selectedProviderId()!)));
  public productsWithPricing = computed(() => signal(this.getProductsWithPricing()));

  public areSubmitButtonsValid() {
    return (this.selectedProviderId() ? true:false) && this.productsWithPricing()().some(product => product.subtotal > 0 && product.quantity > 0);
  }

  private getProductsWithPricing(): ProductWithPricing[] {
    return this.products()().map(product => this.productService.mapProductResponseToProductWithPricing(product));
  }

  public onCalculateSubmit() {
    const modifiedProductsWithPricing = this.productsWithPricing()().map(product => {
      if (product.subtotal > 0 && product.quantity > 0) {
        const productBasePrice = (product.subtotal / product.quantity);      
        const productProfit = productBasePrice * (Number(this.provider()!.percentages.profitPercentage) / 100);
        const productVat = productBasePrice * (Number(this.provider()!.percentages.vatPercentage) / 100);
  
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
    this.alertService.getSuccessToast('Precios calculados correctamente').fire();
  }

  public onPercentagesSubmit() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas continuar?', 'Se modificarán los porcentajes del proveedor seleccionado', 'APLICAR')
    .fire()
    .then((result: any) => { if (result.isConfirmed) this.applyNewPercentages(); });
  }

  private applyNewPercentages() {
    const providerRequest = this.providerService.mapProviderResponseToRequest(this.provider()!);

    this.providerService.editProvider(this.selectedProviderId(), providerRequest).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  public onApplySubmit() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas continuar?', 'Se modificarán los precios de todos los productos de la lista', 'APLICAR')
    .fire()
    .then((result: any) => { if (result.isConfirmed) this.applyNewPrices(); });
  }

  private applyNewPrices() {
    const modifiedProducts = this.productsWithPricing()().map(product => { return {...(({ subtotal, unit, quantity, ...rest }) => rest)(product)} })
    this.products().set(modifiedProducts);

    this.productService.editProductsPrice(this.products()()).pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private handleSuccess(response: string): void {
    this.alertService.getSuccessToast(response).fire();
    this.productsWithPricing().set(this.getProductsWithPricing());
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

}