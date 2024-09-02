import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { catchError, from, Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (req.url.includes('/refresh')) {
    console.log("Interceptor: SE DETECTÓ QUE SE QUIERE LLAMAR A REFRESH")
    const token$ = from(tokenService.getToken());
    return token$.pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: token
            }
          });
        }
        return next(req);
      })
    );
  }

  console.log("Interceptor: Llamando a get token");
  const token$ = from(tokenService.getToken()); // Transformamos la promise en un observable.
  console.log("token$")
  return from(token$).pipe( // Usamos pipe para aplicar métodos.
    switchMap((token) => { // Obtenemos el valor que devuelve el observable token$.
      if (token) {
        console.log("Interceptor: Hay un token almacenado")
        if (tokenService.isTokenExpired(token)) { // Si el token expiró llamamos al siguiente Observable con el valor del primer observable token$.
          console.log("Interceptor: Se detectó que el token expiró");
          const refresh$ = from(authService.refresh()); // Antes de llamarlo, transformamos la promise en el observable.
          return refresh$.pipe(
            switchMap((response) => { // Aplicamos otro switchMap más, para obtener el valor del observable.

              const updatedToken: string = response.headers.get('Authorization')!;

              tokenService.setToken(updatedToken); // Seteamos el nuevo token actualizado (por otros 15 minutos).

              req = req.clone({ // Clonamos la request y le agregamos en el header el token nuevo.
                setHeaders: {
                  Authorization: updatedToken
                }
              });

              console.log("Interceptor: Actualizamos el token");
              console.log(updatedToken);

              return next(req);
            }),
            catchError(() => {
              console.log("Interceptor: Se detecto un error en el interceptor")
              tokenService.clearToken();
              return next(req);
            })
          );

        } else { // Si todavía le queda tiempo al token, agregamos en el header de la request el token original.
          console.log("Interceptor: Al token le queda tiempo antes de expirar, lo seguimos mandando")

          req = req.clone({
            setHeaders: {
              Authorization: token
            }
          });
        }
      }
      return next(req);
    })
  )
};