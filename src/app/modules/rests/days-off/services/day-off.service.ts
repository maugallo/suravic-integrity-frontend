import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DayOffRequest, DayOffResponse } from '../models/day-off.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class DayOffService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/days-off`;

  private refreshDaysOff$ = new BehaviorSubject<void>(undefined);

  public daysOff: Signal<DayOffResponse[]> = toSignal(this.refreshDaysOff$.pipe(
    switchMap(() => this.getDaysOff())), { initialValue: [] });

  public getDaysOffByEmployeeId(id: number) {
    return this.daysOff().filter(dayOff => dayOff.employee.id === id);
  }

  private getDaysOff(): Observable<DayOffResponse[]> {
    return this.http.get<DayOffResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getDaysOffById(id: number): DayOffResponse[] {
    return this.daysOff().filter((dayOff) => dayOff.id === id)!;
  }

  public createDayOff(dayOff: DayOffRequest): Observable<string> {
    return this.http.post(this.apiUrl, dayOff, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshDaysOff$.next()));
  }

  public deleteDayOff(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshDaysOff$.next()));
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
