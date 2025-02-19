import { Component, inject, viewChild } from '@angular/core';
import { IonModal, IonContent } from "@ionic/angular/standalone";
import { CategoryDashboardComponent } from '../category-dashboard/category-dashboard.component';
import { CategoryStore } from '../../stores/category.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  imports: [IonContent, IonModal, CategoryDashboardComponent],
  standalone: true
})
export class CategoryModalComponent {

  private categoryStore = inject(CategoryStore);

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.
  public ionModal = viewChild(IonModal);

  constructor() {
    watchState(this.categoryStore, () => {
      if (this.categoryStore.success()) this.closeModal();
    });
  }

  public setInert(value: boolean) {
    this.isInert = value;
  }

  public closeModal() {
    this.ionModal()!.dismiss();
  }
  
}
