import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  async setToken(token: string): Promise<void> {
    await Preferences.set({
      key: 'jwt',
      value: token
    });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'jwt' });
    return value;
  }

  async clearToken(): Promise<void> {
    await Preferences.remove({ key: 'jwt' });
  }

}
