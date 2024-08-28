import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  async setToken(token: string): Promise<void> {
    await Preferences.set({
      key: 'jwt',
      value: token
    });
  }

  async getToken(): Promise<string> {
    const { value } = await Preferences.get({ key: 'jwt' });
    return value ? value : '';
  }

  async clearToken(): Promise<void> {
    await Preferences.remove({ key: 'jwt' });
  }

  public getRoleFromToken(token: string): string {
    const decodedToken = this.decodeToken(token);
    const role = decodedToken.authorities[0]; // Array of 1 element
    return role ? role : ''; // Should have [ROLE_DUENO] or [ROLE_ENCARGADO]
  }

  public isTokenExpired(token: string) {
    const expiration = this.getExpirationTimeFromToken(token);
    const now = new Date();

    return ((expiration.getTime() - now.getTime()) < 2 * 60 * 1000) // Si le quedan menos de 2 minutos para expirar, devuelve true.
  }

  private getExpirationTimeFromToken(token: string): Date {
    const decodedToken = this.decodeToken(token);
    const exp = decodedToken.exp;

    return new Date(exp * 1000); // Convert Unix timestamp to JavaScript Date object
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    const decodedPayload = atob(payload); // Decode the Base64 encoded payload
    return JSON.parse(decodedPayload); // Parse the payload as a JSON object
  }

}
