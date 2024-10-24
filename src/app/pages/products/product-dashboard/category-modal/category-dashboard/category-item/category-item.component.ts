import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { CategoryRequest, CategoryResponse } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, ]
})
export class CategoryItemComponent {

  private destroyRef = inject(DestroyRef);
  
  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);

  public category = input<CategoryResponse>();

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.

  public updatedCategory: CategoryRequest = {
    name: ''
  }

  // Edit category.
  public openEditCategoryAlert() {
    this.turnInert.emit(true);

    this.alertService.getInputAlert('EDITAR CATEGORÍA <i class="fa-solid fa-pen-to-square fa-1x"></i>', 'Ingrese un nombre', 'EDITAR', this.handleValidations(), this.category()!.name)
      .fire()
      .finally(() => this.turnInert.emit(false));
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
        return this.handleEdit();
      }
      return false;
    }
  }

  // Usamos firstValueFrom para obtener el primero (y único) valor que el observable devuelve, y transformarlo en una Promise.
  private handleEdit() {
    return firstValueFrom(this.categoryService.editCategory(this.category()!.id, this.updatedCategory).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => {
        Swal.showValidationMessage(error.message);
        return of(null);
      })
    ));
  }

  // Delete category.
  public openDeleteCategoryAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar la categoría?')
      .fire()
      .then((result) => {
        if (result.isConfirmed) {
          this.handleDelete();
        }
      });
  }

  private handleDelete() {
    this.categoryService.deleteOrRecoverCategory(this.category()!.id).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
