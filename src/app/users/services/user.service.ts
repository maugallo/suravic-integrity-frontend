import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
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

  public users: Signal<UserResponse[]> = toSignal(this.refreshUsers$.pipe(
    switchMap(() => this.getUsers())), { initialValue: [] });

  public getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public createUser(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user)
      .pipe(catchError(this.handleError));
  }

  public editUser(id: number, user: UserRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, user, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshUsers$.next()));
  }

  public deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshUsers$.next()));
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
