import { Component, inject, input, output } from '@angular/core';
import { CategoryRequest, CategoryResponse } from 'src/app/modules/categories/models/category.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { CategoryStore } from '../../../stores/category.store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class CategoryItemComponent {

  private alertService = inject(AlertService);
  private categoryStore = inject(CategoryStore);

  public category = input<CategoryResponse>();

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.

  public updatedCategory: CategoryRequest = {
    name: ''
  }

  // Edit category.
  public openEditCategoryAlert() {
    this.turnInert.emit(true);
    this.alertService.showInputAlert(
      'MODIFICAR CATEGORÍA <i class="fa-solid fa-pen-to-square fa-1x"></i>', 'Ingrese un nombre',
      'EDITAR', this.handleValidations()
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
      } else if (value !== this.category()!.name) {
        this.updatedCategory.name = value;
        this.categoryStore.editEntity({ id: this.category()!.id, entity: this.updatedCategory });
        return true;
      }
      return false;
    }
  }

  public openDeleteCategoryAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar la categoría?', 'Esta acción no se puede deshacer')
      .then((result: any) => {
        if (result.isConfirmed) {
          this.categoryStore.deleteEntity(this.category()!.id);
        }
      });
  }

}
