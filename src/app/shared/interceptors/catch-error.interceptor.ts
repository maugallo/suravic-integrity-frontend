import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AlertService } from '../services/alert.service';

export const catchErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);

  if (req.url.includes('refresh')) {
    return next(req).pipe(
      catchError(error => {
        console.error('Error al querer llamar al endpoint api/auth/refresh:', error);
        console.error("Procediendo a desloguearse");
        alertService.getErrorAlert("La sesión expiró");
        
        return authService.logout().pipe(switchMap(() => EMPTY));
      })
    );
  }

  return next(req).pipe(
    catchError((error) => errorService.handleError(error))
  );
};
