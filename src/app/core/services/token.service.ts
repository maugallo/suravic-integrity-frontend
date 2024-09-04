import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public setToken(token: string): Observable<void> {
    return from(Preferences.set({
      key: 'jwt',
      value: token
    }));
  }

  public getToken(): Observable<string> {
    return from(Preferences.get({ key: 'jwt' }).then(({ value }) => value ? value : ''));
  }

  public clearToken(): Observable<void> {
    return from(Preferences.remove({ key: 'jwt' }));
  }

  public getRoleFromToken(token: string): string {
    const decodedToken = this.decodeToken(token);
    const role = decodedToken.authorities[0];
    return role ? role : ''; // Debería retornar [ ROLE_DUENO ] o [ ROLE_ENCARGADO ]
  }

  public isTokenExpired(token: string) {
    const expiration = this.getExpirationTimeFromToken(token);
    const now = new Date();

    return ((expiration.getTime() - now.getTime()) < 2 * 60 * 1000) // Si le quedan menos de 2 minutos para expirar, devuelve true.
  }

  private getExpirationTimeFromToken(token: string): Date {
    const decodedToken = this.decodeToken(token);
    const exp = decodedToken.exp;

    return new Date(exp * 1000);
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    const decodedPayload = atob(payload); // Decode the Base64 encoded payload
    return JSON.parse(decodedPayload); // Parse the payload as a JSON object
  }

}
