import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  public handleError(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.error));
      case 401:
        return throwError(() => new Error("Usuario o contraseña incorrectos"));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      case 0:
        return throwError(() => new Error("No se pudo conectar con el servidor"));
      default:
        return throwError(() => new Error("Ocurrió un error desconocido"));
    }
  }

}
