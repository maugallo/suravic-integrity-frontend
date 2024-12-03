import { Component, DestroyRef, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ProductRequest } from '../../models/product.model';
import { CategoryService } from 'src/app/modules/categories/services/category.service';
import { ProductService } from '../../services/product.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { ProviderService } from 'src/app/modules/providers/services/provider.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { ProductMapper } from 'src/app/shared/mappers/product.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, TextInputComponent, NumberInputComponent, SelectInputComponent, SubmitButtonComponent],
standalone: true
})
export class ProductFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private productService = inject(ProductService);
  private providerService = inject(ProviderService);
  private categoryService = inject(CategoryService);
  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);

  public providers = this.providerService.providers;
  public categories = this.categoryService.categories;

  public isProductEdit!: boolean;
  public productId: number = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  public product: Signal<ProductRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const productId = params.get('id');
      if (this.isParameterValid(productId)) {
        const product = this.productService.getProductById(Number(productId));
        if (!product) this.router.navigate(['products', 'dashboard']);
        this.isProductEdit = true;
        this.productId = product.id;
        return of(ProductMapper.toProductRequest(product));
      } else {
        this.isProductEdit = false;
        return of(EntitiesUtility.getEmptyProductRequest());
      }
    })
  ));

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    this.getFormOperation().pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
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

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
