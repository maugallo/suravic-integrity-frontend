import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLoginRequest } from 'src/app/modules/users/models/user.model';
import { catchError, forkJoin, Observable, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StorageType } from 'src/app/shared/models/storage-type.enum';
import { TokenUtility } from 'src/app/shared/utils/token.utility';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ErrorService } from 'src/app/shared/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageService = inject(StorageService);
  private alertService = inject(AlertService);
  private errorService = inject(ErrorService);
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  public login(user: UserLoginRequest): Observable<[void, void, void]> {
    const headers = new HttpHeaders({ 'Authorization': 'Basic ' + btoa(`${user.username}:${user.password}`) });

    return this.http.get(`${this.apiUrl}/login`, { headers, observe: 'response' })
      .pipe(
        switchMap((response) => {
          const token = response.headers.get('Authorization');
          const refreshToken = response.headers.get('Authorization-Refresh');
          if (token && refreshToken) {
            const userId = TokenUtility.getUserIdFromToken(token);
            return forkJoin([
              this.storageService.setStorage(StorageType.TOKEN, token),
              this.storageService.setStorage(StorageType.REFRESH_TOKEN, refreshToken),
              this.storageService.setStorage(StorageType.USER_ID, userId)
            ]);
          } else {
            return throwError(() => new Error("No se recibió un token o un refreshToken de los headers durante el login."));
          }
        }),
        catchError(this.errorService.handleError)
      );
  }

  public logout(): Observable<[void, void, void]> {
    return forkJoin([
      this.storageService.clearStorage(StorageType.TOKEN),
      this.storageService.clearStorage(StorageType.REFRESH_TOKEN),
      this.storageService.clearStorage(StorageType.USER_ID),
    ]).pipe(tap(() => this.router.navigate(['welcome'])));
  }

  public refresh(): Observable<void | [void, void, void]> {
    return this.storageService.getStorage(StorageType.REFRESH_TOKEN).pipe(
      switchMap((refreshToken) => {
        const headers = new HttpHeaders({ 'Authorization-Refresh': refreshToken });
        return this.http.get(`${this.apiUrl}/refresh`, { headers, observe: 'response' })
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
        this.alertService.getErrorAlert("La sesión expiró").fire();
        return this.logout()
      })
    );
  }

}