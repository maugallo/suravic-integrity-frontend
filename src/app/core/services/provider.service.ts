import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProviderRequest, ProviderResponse } from '../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/providers`;

  public getProviders(isEnabled: boolean): Observable<ProviderResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<ProviderResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  public getProviderById(id: number): Observable<ProviderResponse> {
    return this.http.get<ProviderResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  public createProvider(provider: ProviderRequest): Observable<string> {
    return this.http.post(this.apiUrl, provider, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public editProvider(id: number, provider: ProviderRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, provider, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public deleteOrRecoverProvider(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
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
        return throwError(() => new Error("Error"));
    }
  }

}