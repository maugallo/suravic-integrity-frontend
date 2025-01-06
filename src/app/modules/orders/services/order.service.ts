import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderResponse } from '../models/order.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements BaseService<FormData, OrderResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/orders`;

  public getEntities(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl);
  }

  public createEntity(orderData: FormData): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData);
  }

  public editEntity(id: number, orderData: FormData): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}`, orderData);
  }

  public deleteEntity(id: number): Observable<OrderResponse> {
    return this.http.delete<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  public getInvoiceFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/invoice`, { responseType: 'blob' });
  }

  public getPaymentReceiptFile(id: number): Observable<Blob | undefined> {
    return this.http.get(`${this.apiUrl}/${id}/payment-receipt`, { responseType: 'blob' })
      .pipe(map((blob) => (!blob || blob.size === 0) ? undefined : blob));
  }

}
