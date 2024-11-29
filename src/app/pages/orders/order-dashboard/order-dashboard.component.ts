import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar, MenuController } from "@ionic/angular/standalone";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { OrderItemComponent } from "./order-item/order-item.component";
import { OrderResponse } from 'src/app/core/models/interfaces/order.model';
import { OrdersFilterComponent } from "../../../shared/components/filters/orders-filter/orders-filter.component";
import { DeletedButtonComponent } from "../../../shared/components/deleted-button/deleted-button.component";
import { Filter } from 'src/app/core/models/interfaces/filter.model';

@Component({
    selector: 'app-order-dashboard',
    templateUrl: './order-dashboard.component.html',
    styleUrls: ['./order-dashboard.component.scss'],
    imports: [IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, OrderItemComponent, OrdersFilterComponent, DeletedButtonComponent]
})
export class OrderDashboardComponent {

  public router = inject(Router);
  private menuController = inject(MenuController)

  private orderService = inject(OrderService);

  public orders = this.orderService.orders;
  private searchQuery: WritableSignal<string> = signal('');
  private filters = signal<Filter[]>([]);

  public filteredOrders = computed(() => {
    const orders = this.filterOrders(this.orders(), this.filters(), this.seeDeleted());

    return this.sortedByDate(orders.filter(order => order.provider.companyName.toLowerCase().includes(this.searchQuery())));
  });

  public seeDeleted = signal(false);

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
    this.menuController.open("filter-menu");
  }
  public receiveFilters(filters: any) {
    this.filters.set([...filters]);
    /* IMPORTANTE: Angular compara la referencia del array y,
    al no cambiar la referencia del array en sí
    (solo sus elementos internos), no dispara la reactividad.
    Por eso tenemos que asignar un array completamente nuevo,
    pisando el anterior. */
  }

  private filterOrders(orders: OrderResponse[], filters: Filter[], seeDeleted: boolean) {
    let filteredOrders = orders.filter(order => order.isEnabled !== seeDeleted);

    if (filters.length > 0) {
      const paymentMethodsFilter = filters[0].value;
      const providersFilter = filters[1].value;
      const pricesFilter = filters[2].value;

      console.log(paymentMethodsFilter);
      console.log(providersFilter);
      console.log(pricesFilter);

      return filteredOrders.filter(order => {
        const orderPaymentMethodsIds = order.paymentMethods.map(method => method.id);

        return (paymentMethodsFilter.length === 0 || paymentMethodsFilter.some(id => orderPaymentMethodsIds.includes(id))) &&
        (providersFilter.length === 0 || providersFilter.includes(order.provider.id)) &&
        (pricesFilter.length === 0 || (Number(order.total) >= pricesFilter[0] && Number(order.total) <= pricesFilter[1]))
      });
    }
    return filteredOrders;
  }

}
