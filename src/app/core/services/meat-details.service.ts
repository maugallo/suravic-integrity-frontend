import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductWithMeatDetails } from '../models/interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class MeatDetailsService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/meat-products`;

  private refreshMeatDetails$ = new BehaviorSubject<void>(undefined);

  public meatDetails(category: string) {
    return toSignal(this.refreshMeatDetails$.pipe(
      switchMap(() => this.getMeatDetails(category))), { initialValue: [] });
  }

  private getMeatDetails(category: string): Observable<ProductWithMeatDetails[]> {
    return this.http.get<ProductWithMeatDetails[]>(`${this.apiUrl}/${category}`)
      .pipe(catchError(this.handleError));
  }

  public editMeatDetails(meatDetails: ProductWithMeatDetails[]): Observable<string> {
    return this.http.put(this.apiUrl, meatDetails, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshMeatDetails$.next()));
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
