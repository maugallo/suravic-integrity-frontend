import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeRequest, EmployeeResponse } from '../models/interfaces/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/employees`;

  private refreshEmployees$ = new BehaviorSubject<void>(undefined);

  public refreshEmployees() {
    this.refreshEmployees$.next();
  }

  public employees = toSignal(this.refreshEmployees$.pipe(
    switchMap(() => this.getEmployees())), { initialValue: [] });

  private getEmployees(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getEmployeeById(id: number) {
    return this.employees().find(employee => employee.id === id)!;
  }

  public createEmployee(employee: EmployeeRequest): Observable<string> {
    return this.http.post(this.apiUrl, employee, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshEmployees$.next()));
  }

  public editEmployee(id: number, employee: EmployeeRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, employee, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshEmployees$.next()));
  }

  public deleteOrRecoverEmployee(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshEmployees$.next()));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.error));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error(error.message));
      default:
        return throwError(() => error);
    }
  }

}
