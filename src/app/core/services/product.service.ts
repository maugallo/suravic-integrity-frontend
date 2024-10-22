import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductRequest, ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  private refreshProducts$ = new BehaviorSubject<void>(undefined);

  public refreshProducts() {
    this.refreshProducts$.next();
  }

  public products = toSignal(this.refreshProducts$.pipe(
    switchMap(() => this.getProducts(true))), { initialValue: [] });

  private getProducts(isEnabled: boolean): Observable<ProductResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<ProductResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  public getProductsByCategory(category: string) {
    return toSignal(this.getProducts(true).pipe(
      map(products => products.filter(product => product.category.name.toLowerCase() === category))
    ), { initialValue: [] });
  }

  public getProductsByProvider(providerId: number) {
    return toSignal(this.getProducts(true).pipe(
      map(products => products.filter(product => product.provider.id === providerId))
    ), { initialValue: [] });
  }

  public getProductById(id: number) {
    return this.products().find(product => product.id === id)!;
  }

  public createProduct(product: ProductRequest): Observable<string> {
    return this.http.post(this.apiUrl, product, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public editProduct(id: number, product: ProductRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, product, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public deleteOrRecoverProduct(id: number): Observable<string> {
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
        return throwError(() => new Error(error.message));
    }
  }

}
