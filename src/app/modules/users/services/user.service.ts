import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/users`;

  public getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public createUser(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user)
      .pipe(catchError(this.handleError));
  }

  public editUser(id: number, user: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user)
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
        return throwError(() => error);
    }
  }

}
