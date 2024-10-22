import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MeatProduct } from '../models/meat-product.model';

@Injectable({
  providedIn: 'root'
})
export class MeatProductService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/meat-products`;

  private refreshMeatProducts$ = new BehaviorSubject<void>(undefined);

  public refreshMeatProducts() {
    this.refreshMeatProducts$.next();
  }

  public meatProducts = toSignal(this.refreshMeatProducts$.pipe(
    switchMap(() => this.getMeatProducts())), { initialValue: [] });

  private getMeatProducts(): Observable<MeatProduct[]> {
    return this.http.get<MeatProduct[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public editMeatProducts(meatProducts: MeatProduct[]): Observable<string> {
    return this.http.put(this.apiUrl, meatProducts, { responseType: 'text' })
      .pipe(catchError(this.handleError));
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
        return throwError(() => new Error(error.message));
    }
  }

}
