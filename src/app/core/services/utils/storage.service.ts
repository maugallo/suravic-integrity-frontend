import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public setStorage(key: string, value: any): Observable<void> {
    return from(Preferences.set({
      key: key,
      value: (typeof value === 'object' || typeof value === 'number' ? JSON.stringify(value) : value)
    }));
  }

  public getStorage(key: string): Observable<any> {
    return from(Preferences.get({ key: key }).then(({ value }) => {
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }));
  }

  public clearStorage(key: string): Observable<void> {
    return from(Preferences.remove({ key: key }));
  }
}
