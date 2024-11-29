import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShiftRequest, ShiftResponse } from '../models/shift.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EmployeeService } from 'src/app/employees/services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shifts`;

  private employeeService = inject(EmployeeService);

  private refreshShifts$ = new BehaviorSubject<void>(undefined);

  public shifts: Signal<ShiftResponse[]> = toSignal(this.refreshShifts$.pipe(
    switchMap(() => this.getShifts())), { initialValue: [] });

  private getShifts(): Observable<ShiftResponse[]> {
    return this.http.get<ShiftResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getShiftById(id: number) {
    return this.shifts().find((shift) => shift.id === id)!;
  }

  public createShift(shift: ShiftRequest): Observable<string> {
    return this.http.post(this.apiUrl, shift, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshShifts$.next()));
  }

  public editShift(id: number, shift: ShiftRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, shift, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => {
        this.refreshShifts$.next();
        this.employeeService.refreshEmployees();
      }));
  }

  public deleteShift(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshShifts$.next()));
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
