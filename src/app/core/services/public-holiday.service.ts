import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicHolidayRequest, PublicHolidayResponse } from '../models/interfaces/public-holiday.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PublicHolidayService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/public-holidays`;

  private refreshPublicHolidays$ = new BehaviorSubject<void>(undefined);

  public publicHolidays: Signal<PublicHolidayResponse[]> = toSignal(this.refreshPublicHolidays$.pipe(
    switchMap(() => this.getPublicHolidays())), { initialValue: [] });

  private getPublicHolidays(): Observable<PublicHolidayResponse[]> {
    return this.http.get<PublicHolidayResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getPublicHolidayById(id: number) {
    return this.publicHolidays().find((publicHoliday) => publicHoliday.id === id)!;
  }

  public createPublicHoliday(publicHoliday: PublicHolidayRequest): Observable<string> {
    return this.http.post(this.apiUrl, publicHoliday, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshPublicHolidays$.next()));
  }

  public editPublicHoliday(id: number, publicHoliday: PublicHolidayRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, publicHoliday, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshPublicHolidays$.next()));
  }

  public deletePublicHoliday(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshPublicHolidays$.next()));
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
