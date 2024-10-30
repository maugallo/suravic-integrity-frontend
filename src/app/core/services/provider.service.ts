import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProviderRequest, ProviderResponse } from '../models/interfaces/provider.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/providers`;

  private productService = inject(ProductService);

  private refreshProviders$ = new BehaviorSubject<void>(undefined);

  public refreshProviders() {
    this.refreshProviders$.next();
  }

  public providers = toSignal(this.refreshProviders$.pipe(
    switchMap(() => this.getProviders())), { initialValue: [] });

  private getProviders(): Observable<ProviderResponse[]> {
    return this.http.get<ProviderResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  public getProviderById(id: number) {
    return this.providers().find(provider => provider.id === id)!;
  }

  public createProvider(provider: ProviderRequest): Observable<string> {
    return this.http.post(this.apiUrl, provider, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => this.refreshProviders$.next()));
  }

  public editProvider(id: number, provider: ProviderRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, provider, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => {
        this.refreshProviders$.next();
        this.productService.refreshProducts();
      }));
  }

  public deleteOrRecoverProvider(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError), tap(() => {
        this.refreshProviders$.next()
        this.productService.refreshProducts();
      }));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.error));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error(error.message));
      default:
        return throwError(() => error);
    }
  }

}