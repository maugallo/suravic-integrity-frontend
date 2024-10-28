import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderRequest, OrderResponse } from '../models/interfaces/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  private refreshOrders$ = new BehaviorSubject<void>(undefined);

  public orders = toSignal(this.refreshOrders$.pipe(
    switchMap(() => this.getOrders())), { initialValue: [] });

  private getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getOrderById(id: number) {
    return this.orders().find(order => order.id === id)!;
  }

  public getInvoiceFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/invoice`, { responseType: 'blob' })
    .pipe(catchError(this.handleError));
  }

  public getPaymentReceiptFile(id: number): Observable<Blob | null> {
    return this.http.get(`${this.apiUrl}/${id}/payment-receipt`, { responseType: 'blob' })
      .pipe(
        map((blob) => {
          // Verificamos si la respuesta es una Blob vacía, que podría representar un 204 No Content
          if (!blob || blob.size === 0) {
            return null;
          }
          return blob;
        }),
        catchError((error) => {
          if (error.status === 204) {
            // Si la respuesta es un 204 No Content, retornamos null
            return of(null);
          }
          // Si el error es otro, manejamos el error de la forma usual
          return this.handleError(error);
        })
      );
  }
  
  public createOrder(orderData: FormData): Observable<string> {
    return this.http.post(this.apiUrl, orderData, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshOrders$.next()));
  }

  public editOrder(id: number, orderData: FormData): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, orderData, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshOrders$.next()));
  }

  public deleteOrRecoverOrder(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshOrders$.next()));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.error));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => error);
    }
  }
  
}
