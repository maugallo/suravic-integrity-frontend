import { Component, inject, output } from '@angular/core';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { CategoryRequest } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonButton, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { CategoryItemComponent } from "./category-item/category-item.component";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-category-dashboard',
    templateUrl: './category-dashboard.component.html',
    styleUrls: ['./category-dashboard.component.scss'],
    imports: [IonProgressBar, IonList, IonButton, HeaderComponent, NotFoundComponent, CategoryItemComponent],
standalone: true
})
export class CategoryDashboardComponent {

  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);

  public turnInert = output<boolean>(); // Necesario para que el input del sweet alert no tenga conflicto con el modal de Ionic.
  
  public categories = this.categoryService.categories;
  public category: CategoryRequest = { name: '' };

  public openAddCategoryAlert() {
    this.turnInert.emit(true);
/*     this.alertService.getInputAlert('AGREGAR CATEGORÍA <i class="fa-duotone fa-solid fa-tags fa-1x"></i>', 'Ingrese un nombre', 'AGREGAR', this.handleValidations())
      
      .finally(() => this.turnInert.emit(false)) */;
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
        return this.handleCreation();
      }
    }
  }

  // Usamos firstValueFrom para obtener el primero (y único) valor que el observable devuelve, y transformarlo en una Promise.
  private handleCreation() {
    return firstValueFrom(this.categoryService.createCategory(this.category).pipe(
      tap((response) => this.alertService.getSuccessToast(response)),
      catchError((error) => {
        Swal.showValidationMessage(error.message);
        return of(null);
      })
    ));
  }

}
