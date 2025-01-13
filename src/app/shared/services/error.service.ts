import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  public handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);

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

  public handleBlobError(error: Blob): Observable<never> {
    return from(error.text()).pipe(
      switchMap((errorMessage) => throwError(() => new Error(errorMessage)))
    )
  }

  public handleRefreshError(error: HttpErrorResponse): Observable<never> {
    console.error('Error al llamar al endpoint api/auth/refresh:', error);
    console.error('Procediendo a desloguearse');
    this.alertService.getErrorAlert('La sesión expiró');

    return this.authService.logout().pipe(
      switchMap(() => EMPTY));
  }

}
