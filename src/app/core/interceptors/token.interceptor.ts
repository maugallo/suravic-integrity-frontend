import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { catchError, from, Observable, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Excluir las solicitudes de login y refresh del interceptor para evitar bucles infinitos
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    console.log("Interceptor: Solicitud de login o refresh, no se modifica el header");
    return next(req);
  }

  console.log("Interceptor: Llamando a get token");

  return tokenService.getToken().pipe(
    switchMap((token) => {
      if (token) {
        console.log("Interceptor: Hay un token almacenado, agregando al header de la solicitud");

        // Si el token ha expirado, intentamos refrescarlo
        if (tokenService.isTokenExpired(token)) {
          console.log("Interceptor: El token ha expirado, intentando refresh");

          return authService.refresh().pipe(
            switchMap((newToken: string) => {
              console.log("Interceptor: Token refrescado exitosamente");

              // Guardar el nuevo token
              return tokenService.setToken(newToken).pipe(
                switchMap(() => {
                  // Clonar la solicitud original con el nuevo token
                  req = req.clone({
                    setHeaders: {
                      Authorization: newToken  // Asegúrate de que el nuevo token se use correctamente
                    }
                  });

                  // Reintentar la solicitud original con el nuevo token
                  return next(req);
                })
              );
            }),
            catchError((err) => {
              console.error("Interceptor: Error al refrescar el token, redirigiendo al login");
              return tokenService.clearToken().pipe(
                tap(() => router.navigate(['/login'])),  // Redirigir al login
                switchMap(() => throwError(() => new Error(err)))
              );
            })
          );
        } else {
          // Si el token no ha expirado, agregarlo a la solicitud
          req = req.clone({
            setHeaders: {
              Authorization: token  // Asegúrate de usar el formato correcto
            }
          });
          return next(req);
        }
      } else {
        // Si no hay token, simplemente pasamos la solicitud
        return next(req);
      }
    })
  );
};
