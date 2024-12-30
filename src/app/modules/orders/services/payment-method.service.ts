import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethod } from '../models/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/payment-methods`;

  public getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.apiUrl);
  }

}
