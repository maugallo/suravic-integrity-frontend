import { Component, computed, inject, output } from '@angular/core';
import { IonContent, IonMenu, IonSelectOption, IonButton, MenuController, IonLabel, IonRange } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';
import { PaymentMethodStore } from 'src/app/modules/orders/stores/payment-method.store';
import { SelectInputComponent } from "../../../../../shared/components/form/select-input/select-input.component";

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
  imports: [IonContent, IonMenu, IonSelectOption, IonButton, IonLabel, IonRange, FormsModule, CurrencyPipe, SelectInputComponent],
  standalone: true
})
export class OrderFilterComponent {

  private providerStore = inject(ProviderStore);
  private paymentMethodStore = inject(PaymentMethodStore);
  private menuController = inject(MenuController);

  public filtersEmitter = output<OrderFilters>();

  public paymentMethods = computed(() => this.paymentMethodStore.entities());
  public providers = computed(() => this.providerStore.enabledEntities());

  public MIN_TOTAL = MIN_TOTAL;
  public MAX_TOTAL = MAX_TOTAL;
  public totalRange = { lower: MIN_TOTAL, upper: MAX_TOTAL };

  public filters: OrderFilters = {
    providers: [],
    paymentMethods: [],
    totals: []
  }

  public filterOders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-order-menu');
  }

  public clearFilter() {
    this.filters = {
      providers: [],
      paymentMethods: [],
      totals: []
    }
    this.totalRange = { lower: MIN_TOTAL, upper: MAX_TOTAL };

    this.filtersEmitter.emit(this.filters);
  }

  public onPriceRangeChange() {
    this.filters.totals = [this.totalRange.lower, this.totalRange.upper];
  }

}

export const MIN_TOTAL = 0;
export const MAX_TOTAL = 100000;

export interface OrderFilters {
  providers: number[],
  paymentMethods: number[],
  totals: number[]
}