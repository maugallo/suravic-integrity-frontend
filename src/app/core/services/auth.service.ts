import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLoginRequest } from '../models/interfaces/user.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public login(user: UserLoginRequest) {
    const headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa(`${user.username}:${user.password}`) });

    return this.http.get(`${this.apiUrl}/auth/login`, { headers, withCredentials: true, observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  public refresh(): Observable<string> {
    return this.http.get<void>(`${this.apiUrl}/auth/refresh`, { withCredentials: true ,observe: 'response' })
      .pipe(
        map(response => {
          const newToken = response.headers.get('Authorization');
          if (newToken) {
            return newToken;
          } else {
            throw new Error('Fallo al refrescar el token, no se encontró un token de refresh en la response de api/auth/refresh.');
          }
        }),
        catchError(error => {
          console.error('Error al querer llamar al endpoint api/auth/refresh:', error);
          return throwError(() => new Error(error));
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        return throwError(() => new Error("Usuario o contraseña incorrectos"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => new Error(error.error));
    }
  }

}
