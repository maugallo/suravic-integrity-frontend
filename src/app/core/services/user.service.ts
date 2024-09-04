import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRegisterRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public getUsers(isEnabled: boolean): Observable<UserResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<UserResponse[]>(`${this.apiUrl}/users`, { params });
  }

  public getUserById(id: number) {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  public createUser(user: UserRegisterRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/users`, user, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.message));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => new Error("Error"));
    }
  }

}
