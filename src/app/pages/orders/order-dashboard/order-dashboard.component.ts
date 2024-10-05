import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { IonContent, IonSearchbar, IonButton, IonList, IonProgressBar } from "@ionic/angular/standalone";
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { ProductItemComponent } from "../../products/product-dashboard/product-item/product-item.component";
import { OrderItemComponent } from "./order-item/order-item.component";
import { OrderResponse } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-order-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonList, IonButton, IonSearchbar, IonContent, HeaderComponent, NotFoundComponent, ProductItemComponent, OrderItemComponent]
})
export class OrderDashboardComponent {

  public router = inject(Router);
  private orderService = inject(OrderService);

  private searchQuery: WritableSignal<string> = signal('');
  private orders = this.orderService.orders;
  public searchBarResult = computed(() => {
    return this.sortedByDate(this.orders().filter(order => order.provider.companyName.toLowerCase().includes(this.searchQuery())));
  });

  ngOnInit(): void {
    this.renderDashboard();
  }

  ionViewWillEnter() {
    this.renderDashboard();
  }

  public searchForOrders(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public renderDashboard() {
    this.orderService.refreshOrders();
  }

  private sortedByDate(array: OrderResponse[]) {
    return array.sort((a, b) => this.parseDateString(a.deliveryDate).getTime() - this.parseDateString(b.deliveryDate).getTime()); 
  }

  private parseDateString(dateString: string) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Meses en Date son 0 indexados.
  }

}
