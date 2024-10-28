import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
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
    switchMap(() => this.getOrders(true))), { initialValue: [] });

  private getOrders(isEnabled: boolean): Observable<OrderResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<OrderResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  public getOrderById(id: number) {
    return this.orders().find(order => order.id === id)!;
  }

  public createOrder(order: OrderRequest): Observable<string> {
    return this.http.post(this.apiUrl, order, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshOrders$.next()));
  }

  public editOrder(id: number, order: OrderRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, order, { responseType: 'text' })
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
