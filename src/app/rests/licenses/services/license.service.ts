import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LicenseRequest, LicenseResponse } from '../models/license.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/licenses`;

  private refreshLicenses$ = new BehaviorSubject<void>(undefined);

  public licenses: Signal<LicenseResponse[]> = toSignal(this.refreshLicenses$.pipe(
    switchMap(() => this.getLicenses())), { initialValue: [] });

  private getLicenses(): Observable<LicenseResponse[]> {
    return this.http.get<LicenseResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getLicenseById(id: number) {
    return this.licenses().find((license) => license.id === id)!;
  }

  public createLicense(license: LicenseRequest): Observable<string> {
    return this.http.post(this.apiUrl, license, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshLicenses$.next()));
  }

  public editLicense(id: number, license: LicenseRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, license, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshLicenses$.next()));
  }

  public deleteLicense(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshLicenses$.next()));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.error));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => error);
    }
  }

}
