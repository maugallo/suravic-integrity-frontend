import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public setUserId(id: string): Observable<void> {
    return from(Preferences.set({
      key: 'userId',
      value: id
    }));
  }

  public getUserId(): Observable<string> {
    return from(Preferences.get({ key: 'userId' }).then(({ value }) => value ? value : '0'));
  }

  public clearUserId(): Observable<void> {
    return from(Preferences.remove({ key: 'userId' }));
  }

  public setWeightAverages()

}
