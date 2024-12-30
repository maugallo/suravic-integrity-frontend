import { Component, inject, output } from '@angular/core';
import { CategoryRequest } from '../../models/category.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonButton, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { CategoryItemComponent } from "./category-item/category-item.component";
import { CategoryStore } from '../../stores/category.store';
import { watchState } from '@ngrx/signals';
import { ProductStore } from 'src/app/modules/products/store/product.store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-dashboard',
  templateUrl: './category-dashboard.component.html',
  styleUrls: ['./category-dashboard.component.scss'],
  imports: [IonProgressBar, IonList, IonButton, HeaderComponent, NotFoundComponent, CategoryItemComponent],
  standalone: true
})
export class CategoryDashboardComponent {

  private alertService = inject(AlertService);
  private categoryStore = inject(CategoryStore);
  private productStore = inject(ProductStore);

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.

  public categories = this.categoryStore.enabledEntities();
  public category: CategoryRequest = { name: '' };

  constructor() {
    watchState(this.categoryStore, () => {
      if (this.categoryStore.success()) this.handleSuccess(this.categoryStore.message());
      if (this.categoryStore.error()) this.alertService.getErrorAlert(this.categoryStore.message());
    });
  }

  public openAddCategoryAlert() {
    this.turnInert.emit(true);
    this.alertService.showInputAlert(
      'AGREGAR CATEGORÍA <i class="fa-duotone fa-solid fa-tags fa-1x"></i>', 'Ingrese un nombre',
      'AGREGAR', this.handleValidations()
    ).finally(() => this.turnInert.emit(false));
  }

  private handleValidations() {
    return (value: string) => {
      if (!value) {
        Swal.showValidationMessage("Este campo no puede estar vacío");
        return false;
      } else if (!value.match('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')) {
        Swal.showValidationMessage("Este campo solo acepta letras");
        return false;
      } else {
        this.category.name = value;
        this.categoryStore.addEntity(this.category);
        return true;
      }
    }
  }

  private handleSuccess(message: string) {
    if (message.includes('Modificado')) {
      this.productStore.updateEntitiesByCategory(this.categoryStore.lastUpdatedEntity()!);
    }
    this.alertService.getSuccessToast(message);
  }

}
