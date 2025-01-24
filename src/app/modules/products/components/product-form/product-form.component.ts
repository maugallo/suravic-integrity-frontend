import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { ProductMapper } from 'src/app/shared/mappers/product.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';
import { ProductStore } from '../../store/product.store';
import { watchState } from '@ngrx/signals';
import { CategoryStore } from 'src/app/modules/categories/stores/category.store';
import { CategoryResponse } from 'src/app/modules/categories/models/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, TextInputComponent, NumberInputComponent, SelectInputComponent, SubmitButtonComponent],
  standalone: true
})
export class ProductFormComponent {

  private alertService = inject(AlertService);
  private validationService = inject(ValidationService);
  private categoryStore = inject(CategoryStore);
  private productStore = inject(ProductStore);
  private providerStore = inject(ProviderStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public providers = this.providerStore.enabledEntities();
  public categories = this.categoryStore.enabledEntities();

  public productId = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<TextInputComponent | NumberInputComponent | SelectInputComponent>;

  constructor() {
    watchState(this.productStore, () => {
      if (this.productStore.success()) this.handleSuccess(this.productStore.message());
      if (this.productStore.error()) this.handleError(this.productStore.message());
    });
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined))
  ));

  public product = computed(() => {
    if (this.idParam()) {
      const product = this.productStore.getEntityById(this.idParam()!);
      if (this.isProductCategoryDeleted(product.category)) product.category.id = -1
      this.productId = product.id;

      return ProductMapper.toProductRequest(product);
    } else {
      return EntitiesUtility.getEmptyProductRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.idParam()) {
      this.productStore.editEntity({ id: this.productId, entity: this.product() });
    } else {
      this.productStore.addEntity(this.product());
    }
  }

  private handleSuccess(response: string) {
    this.alertService.getSuccessToast(response);
    this.router.navigate(['products', 'dashboard']);
  }

  private handleError(error: string) {
    this.alertService.getErrorAlert(error);
    console.error(error);
  }

  private isProductCategoryDeleted(categoryResponse: CategoryResponse) {
    return !this.categories.some(category => category.id === categoryResponse.id);
  }

}
