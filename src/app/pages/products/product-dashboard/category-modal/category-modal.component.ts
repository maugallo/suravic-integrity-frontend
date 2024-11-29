import { Component } from '@angular/core';
import { IonModal, IonContent } from "@ionic/angular/standalone";
import { CategoryDashboardComponent } from "./category-dashboard/category-dashboard.component";

@Component({
    selector: 'app-category-modal',
    templateUrl: './category-modal.component.html',
    styleUrls: ['./category-modal.component.scss'],
    imports: [IonContent, IonModal, CategoryDashboardComponent],
    standalone: true
})
export class CategoryModalComponent {

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.

  public setInert(value: boolean) {
    this.isInert = value;
  }

}
