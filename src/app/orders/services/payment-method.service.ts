import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethod } from '../models/interfaces/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payment-methods`;

  public paymentMethods = toSignal(this.getPaymentMethods(), { initialValue: [] });

  private getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => error);
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => error);
    }
  }

}
