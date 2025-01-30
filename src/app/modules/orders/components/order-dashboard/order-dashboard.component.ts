import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { IonContent, IonSearchbar, IonButton, IonList, MenuController } from "@ionic/angular/standalone";
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { OrderItemComponent } from "./order-item/order-item.component";
import { OrderResponse } from '../../models/order.model';
import { OrderFilterComponent, OrderFilters } from 'src/app/modules/orders/components/order-dashboard/order-filter/order-filter.component';
import { DeletedButtonComponent } from 'src/app/shared/components/deleted-button/deleted-button.component';
import { OrderStore } from '../../stores/order.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss'],
  imports: [IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, OrderItemComponent, OrderFilterComponent, DeletedButtonComponent],
  standalone: true
})
export class OrderDashboardComponent {

  private alertService = inject(AlertService);
  private orderStore = inject(OrderStore);
  private menuController = inject(MenuController);
  public router = inject(Router);

  public minTotal = computed(() => this.getMinValue(this.orderStore.enabledEntities()));
  public maxTotal = computed(() => this.getMaxValue(this.orderStore.enabledEntities()));

  public seeDeleted = signal(false);
  private searchQuery = signal('');
  private filters = signal<OrderFilters | undefined>(undefined);

  public orders = computed(() => {
    const orders = this.filterOrders(this.filters()!, this.seeDeleted());

    return this.sortedByDate(orders!.filter(order => order.provider.companyName.toLowerCase().includes(this.searchQuery())));
  });

  constructor() {
    watchState(this.orderStore, () => {
      if (this.orderStore.success()) this.alertService.getSuccessToast(this.orderStore.message());
      if (this.orderStore.error()) this.alertService.getErrorAlert(this.orderStore.message());
    });
  }

  public searchForOrders(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  private sortedByDate(array: OrderResponse[]) {
    return array.sort((a, b) => this.parseDateString(a.deliveryDate).getTime() - this.parseDateString(b.deliveryDate).getTime());
  }

  private parseDateString(dateString: string) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Meses en Date son 0 indexados.
  }

  public openFilterMenu() {
    this.menuController.open("filter-order-menu");
  }

  public receiveFilters(filters: OrderFilters) {
    console.log(filters);
    this.filters.set({ ...filters });
  }

  private filterOrders(filters: OrderFilters, seeDeleted: boolean) {
    let filteredOrders = seeDeleted ? this.orderStore.deletedEntities() : this.orderStore.enabledEntities();

    if (filters) {
      return filteredOrders.filter(order => {
        const orderPaymentMethodsIds = order.paymentMethods.map(method => method.id);
        
        return (filters.paymentMethods.length === 0 || filters.paymentMethods.some(id => orderPaymentMethodsIds.includes(id))) &&
        (filters.providers.length === 0 || filters.providers.includes(order.provider.id)) &&
        (filters.totals.length === 0 || (Number(order.total) >= filters.totals[0] && Number(order.total) <= filters.totals[1]))
      });
    }
    return filteredOrders;
  }

  private getMinValue(orders: OrderResponse[]) {
    if (orders.length > 0)
      return Number(orders.reduce((min, current) => Number(current.total) < Number(min.total) ? current : min).total);
    else
      return 0;
  }

  private getMaxValue(orders: OrderResponse[]) {
    if (orders.length > 0)
      return Number(orders.reduce((max, current) => Number(current.total) > Number(max.total) ? current : max).total);
    else
      return 0;
  }

}
