import { Component, computed, inject, input, output } from '@angular/core';
import { IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, MenuController, IonLabel, IonRange } from "@ionic/angular/standalone";
import { PaymentMethodService } from 'src/app/orders/services/payment-method.service';
import { ProviderService } from 'src/app/providers/services/provider.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Filter } from 'src/shared/models/filter.model';
import { OrderResponse } from 'src/app/orders/models/order.model';

@Component({
    selector: 'app-orders-filter',
    templateUrl: './orders-filter.component.html',
    styleUrls: ['./orders-filter.component.scss'],
    imports: [IonContent, IonMenu, IonSelect, IonSelectOption, IonButton, IonLabel, IonRange, FormsModule, CurrencyPipe]
})
export class OrdersFilterComponent {
  private paymentMethodService = inject(PaymentMethodService);
  private providerService = inject(ProviderService);

  private menuController = inject(MenuController);

  public paymentMethods = this.paymentMethodService.paymentMethods;
  public providers = this.providerService.providers;
  public orders = input<OrderResponse[]>();

  public lowestPrice = computed(() => (this.orders() && this.orders()!.length > 0) ? this.getLowestPrice(this.orders()!) : 0);
  public highestPrice = computed(() => (this.orders() && this.orders()!.length > 0) ? this.getHigestPrice(this.orders()!) : 99999);
  public priceRange: { lower: number, upper: number } = { lower: this.lowestPrice(), upper: this.highestPrice() };

  public filtersEmitter = output<Filter[]>();
  public filters: Filter[] = [
    { type: 'paymentMethods', value: [] },
    { type: 'providers', value: [] },
    { type: 'prices', value: [this.priceRange.lower, this.priceRange.upper] }
  ];

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' };

  public filterProviders() {
    this.filtersEmitter.emit(this.filters);
    this.menuController.close('filter-menu');
  }

  public clearFilter() {
    this.filters = [
      { type: 'paymentMethods', value: [] },
      { type: 'providers', value: [] },
      { type: 'prices', value: [] }
    ];
    this.priceRange = { lower: this.lowestPrice(), upper: this.highestPrice() };

    this.filtersEmitter.emit(this.filters);
  }

  public onPriceRangeChange() {
    this.filters[2].value = [this.priceRange.lower, this.priceRange.upper];
  }

  private getLowestPrice(orders: OrderResponse[]): number {
    return Math.min(...orders.map(order => Number(order.total)));
  }

  private getHigestPrice(orders: OrderResponse[]): number {
    return Math.max(...orders.map(order => Number(order.total)));
  }

}
