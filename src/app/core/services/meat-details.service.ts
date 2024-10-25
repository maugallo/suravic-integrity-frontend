import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MeatDetails } from '../models/interfaces/meat-details.model';

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

  private getMeatDetails(category: string): Observable<MeatDetails[]> {
    return this.http.get<MeatDetails[]>(`${this.apiUrl}/${category}`)
      .pipe(catchError(this.handleError));
  }

  public editMeatDetails(meatDetails: MeatDetails[]): Observable<string> {
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
        return throwError(() => new Error(error.message));
    }
  }

}
