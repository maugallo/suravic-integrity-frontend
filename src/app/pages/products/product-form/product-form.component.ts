import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ProductRequest } from 'src/app/core/models/product.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonInput, IonSelect, IonSelectOption, IonNote, IonButton } from "@ionic/angular/standalone";
import { ProviderService } from 'src/app/core/services/provider.service';
import { SessionService } from 'src/app/core/services/utils/session.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonNote, IonContent, HeaderComponent, FormsModule, IonInput, IonSelect, IonSelectOption]
})
export class ProductFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public validationService = inject(ValidationService);
  private productService = inject(ProductService);
  private providerService = inject(ProviderService);
  private categoryService = inject(CategoryService);
  private sessionService = inject(SessionService);
  private alertService = inject(AlertService);

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public isProductEdit!: boolean;
  public productId!: number;

  public providers = this.providerService.providers;
  public categories = this.categoryService.categories;

  public product: Signal<ProductRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const productId = params.get('id');
      if (this.isParameterValid(productId)) {
        const product = this.productService.getProductById(Number(productId));
        if (!product) this.router.navigate(['products', 'dashboard']);
        this.isProductEdit = true;
        this.productId = product.id;
        return of({
          categoryId: product.category.id,
          providerId: product.provider.id,
          userId: product.user.id,
          plu: product.plu,
          title: product.title,
          price: product.price
        });
      } else {
        this.isProductEdit = false;
        return of({
          categoryId: 0,
          providerId: 0,
          userId: 0,
          plu: '',
          title: '',
          price: ''
        });
      }
    })
  ));

  public onCategoryChange(selectedCategoryId: any) {
    this.product()!.categoryId = selectedCategoryId;
  }

  public onProviderChange(selectedProviderId: any) {
    this.product()!.providerId = selectedProviderId;
  }

  public onSubmit(productForm: NgForm) {
    if (!productForm.valid) {
      productForm.form.markAllAsTouched();
      return;
    }

    this.sessionService.getUserId().pipe(
      switchMap((userId: string) => {
        this.product()!.userId = Number(userId);
        return this.getFormOperation().pipe(
          tap((response) => this.handleSuccess(response)),
          catchError((error) => this.handleError(error))
        )
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private getFormOperation(): Observable<any> {
    return this.isProductEdit
      ? this.productService.editProduct(this.productId, this.product()!)
      : this.productService.createProduct(this.product()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['products', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

  public isSelectNotValid(select: NgModel, selectedValue: number) {
    return (select && select.touched && selectedValue === 0);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
