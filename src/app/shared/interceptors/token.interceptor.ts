import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { StorageService, StorageType } from '../services/storage.service';
import { TokenUtility } from '../utils/token.utility';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    console.log("Interceptor: Solicitud de login, refresh o logout, no se modifica el header");
    return next(req);
  }

  console.log("Interceptor: Llamando a get token");

  return storageService.getStorage(StorageType.TOKEN).pipe(
    switchMap((token) => {
      if (token) {
        console.log("Interceptor: Hay un token almacenado, agregando al header de la solicitud");

        if (TokenUtility.isTokenExpired(token)) {
          console.log("Interceptor: El token ha expirado, intentando refresh");

          return authService.refresh().pipe(
            switchMap(() => {
              return storageService.getStorage(StorageType.TOKEN)
            }),
            switchMap((newToken) => {
              req = req.clone({
                setHeaders: {
                  Authorization: newToken
                }
              });

              return next(req); // Reintentar la solicitud original con el nuevo token
            })
          );
        } else {
          req = req.clone({
            setHeaders: {
              Authorization: token
            }
          });
          
          return next(req);
        }
      } else {
        console.warn("Interceptor: No hay token almacenado, procediendo sin encabezado de autorización");
        return next(req);
      }
    })
  );
};
