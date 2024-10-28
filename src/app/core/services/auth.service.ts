import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLoginRequest } from '../models/interfaces/user.model';
import { catchError, forkJoin, Observable, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './utils/storage.service';
import { StorageType } from '../models/enums/storage-type.enum';
import { TokenUtility } from '../models/utils/token.utility';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  private storageService = inject(StorageService);

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public login(user: UserLoginRequest): Observable<[void, void, void]> {
    const headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa(`${user.username}:${user.password}`) });

    return this.http.get(`${this.apiUrl}/auth/login`, { headers, observe: 'response' })
      .pipe(
        switchMap((response) => {
          const token = response.headers.get('Authorization');
          const refreshToken = response.headers.get('Authorization-Refresh');
          if (token && refreshToken) {
            const userId = TokenUtility.getUserIdFromToken(token);
            console.log("Se setea en storage userId");
            console.log(userId)
            return forkJoin([
              this.storageService.setStorage(StorageType.TOKEN, token),
              this.storageService.setStorage(StorageType.REFRESH_TOKEN, refreshToken),
              this.storageService.setStorage(StorageType.USER_ID, userId)
            ]);
          } else {
            return throwError(() => new Error("No se recibió un token o un refreshToken de los headers durante el login."));
          }
        }),
        catchError(this.handleError)
      );
  }

  public logout(): Observable<[void, void, void]> {
    return forkJoin([
      this.storageService.clearStorage(StorageType.TOKEN),
      this.storageService.clearStorage(StorageType.REFRESH_TOKEN),
      this.storageService.clearStorage(StorageType.USER_ID),
    ]).pipe(
      tap(() => {
        console.log("Logout realizado con éxito");
        this.router.navigate(['welcome']);
      })
    );
  }

  public refresh(): Observable<void | [void, void, void]> {
    return this.storageService.getStorage(StorageType.REFRESH_TOKEN).pipe(
      switchMap((refreshToken) => {
        const headers = new HttpHeaders({ 'Authorization-Refresh': refreshToken });
        return this.http.get(`${this.apiUrl}/auth/refresh`, { headers, observe: 'response' })
      }),
      switchMap((response) => {
        const newToken = response.headers.get('Authorization');
        if (newToken) {
          return this.storageService.setStorage(StorageType.TOKEN, newToken);
        } else {
          throw new Error('Fallo al refrescar el token, no se encontró un token en la response de api/auth/refresh.');
        }
      }),
      tap(() => console.log("Refresh realizado correctamente")),
      catchError(error => {
        console.error('Error al querer llamar al endpoint api/auth/refresh:', error);
        console.error("Procediendo a desloguearse");
        return this.logout()
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
        return throwError(() => error);
    }
  }

}