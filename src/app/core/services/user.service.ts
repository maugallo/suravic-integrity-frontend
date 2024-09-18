import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRequest, UserResponse } from '../models/user.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  private refreshUsers$ = new BehaviorSubject<void>(undefined);

  public refreshUsers() {
    this.refreshUsers$.next();
  }

  public users: Signal<UserResponse[]> = toSignal(this.refreshUsers$.pipe(
    switchMap(() => this.getUsers(true))), { initialValue: [] });

  private getUsers(isEnabled: boolean): Observable<UserResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<UserResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  public getUserById(id: number) {
    return this.users().find((user) => user.id === id)!;
  }

  public createUser(user: UserRequest): Observable<string> {
    return this.http.post(this.apiUrl, user, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public editUser(id: number, user: UserRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
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
        return throwError(() => new Error("Error"));
    }
  }

}
