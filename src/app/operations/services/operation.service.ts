import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, combineLatest, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OperationResponse } from '../models/operation.model';
import { EmployeeService } from 'src/app/employees/services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private employeeService = inject(EmployeeService);
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/operations`;

  public accountId$ = new BehaviorSubject<number>(0);
  public refreshOperations$ = new BehaviorSubject<void>(undefined);

  // Observable que obtiene las operaciones basadas en el accountId actual
  public operations = toSignal(
    combineLatest([this.accountId$, this.refreshOperations$]).pipe(
      switchMap(([accountId]) => accountId !== null ? this.getOperations(accountId) : of([]))
    ),
    { initialValue: [] }
  );

  public setAccountId(accountId: number) {
    this.accountId$.next(accountId);
  }

  public refreshOperations() {
    this.refreshOperations$.next();
  }

  private getOperations(accountId: number): Observable<OperationResponse[]> {
    return this.http.get<OperationResponse[]>(`${this.apiUrl}/${accountId}`)
      .pipe(catchError(this.handleError));
  }

  public getOperationById(id: number) {
    return this.operations().find(operation => operation.id === id)!;
  }

  public getReceiptFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/receipt`, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public createOperation(operationData: FormData): Observable<string> {
    return this.http.post(this.apiUrl, operationData, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => {
        this.refreshOperations();
        this.employeeService.refreshEmployees();
      }));
  }

  public editOperation(id: number, operationData: FormData): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, operationData, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => {
        this.refreshOperations();
        this.employeeService.refreshEmployees();
      }));
  }

  public deleteOperation(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => {
        this.refreshOperations();
        this.employeeService.refreshEmployees();
      }));
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
