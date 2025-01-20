import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductRequest, ProductResponse } from '../models/product.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements BaseService<ProductRequest, ProductResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/products`;

  public getEntities(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(this.apiUrl);
  }

  public createEntity(product: ProductRequest): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, product);
  }

  public editEntity(id: number, product: ProductRequest): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  public deleteEntity(id: number): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  public editPrices(products: ProductResponse[]) {
    return this.http.put<ProductResponse[]>(this.apiUrl, products);
  }

}
