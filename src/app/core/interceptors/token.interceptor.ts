import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { from, Observable, switchMap } from 'rxjs';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);

  // Si la solicitud es hacia '/auth/login', no modificamos el header de la solicitud
  if (req.url.includes('/auth/login')) {
    console.log("Interceptor: Solicitud de login, no se modifica el header");
    return next(req);
  }

  console.log("Interceptor: Llamando a get token");
  const token$ = from(tokenService.getToken()); // Transformamos la promesa en un observable.

  return token$.pipe(
    switchMap((token) => {
      if (token) {
        console.log("Interceptor: Hay un token almacenado, agregando al header de la solicitud");

        // Clonamos la solicitud y le agregamos el token en el header de autorización
        req = req.clone({
          setHeaders: {
            Authorization: token
          }
        });
      }
      // Pasamos la solicitud (clonada o no) al siguiente handler
      return next(req);
    })
  );
};
