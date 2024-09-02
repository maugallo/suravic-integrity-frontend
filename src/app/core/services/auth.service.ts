import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLoginRequest } from '../models/user.model';
import { catchError, throwError } from 'rxjs';
import { HeadersService } from './headers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private headersService = inject(HeadersService);
  private apiUrl = environment.apiUrl;

  public login(user: UserLoginRequest) {
    const headers = this.headersService.getBasicAuthHeader(user.username, user.password);

    return this.http.get(`${this.apiUrl}/auth/login`, { headers, observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  public refresh() {
    const headers = this.headersService.getTokenHeader();

    return this.http.get(`${this.apiUrl}/auth/refresh`, { headers, observe: 'response' });
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        return throwError(() => new Error("Usuario o contraseña incorrectos"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => new Error("Error"));
    }
  }

}
