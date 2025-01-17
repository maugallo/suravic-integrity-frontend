import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductWithMeatDetails } from 'src/app/modules/products/models/product.model';
import { MeatDetailsType } from '../models/meat-details-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MeatDetailsService {

  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/meat-products`;

  public getMeatDetails(category: MeatDetailsType): Observable<ProductWithMeatDetails[]> {
    return this.http.get<ProductWithMeatDetails[]>(`${this.apiUrl}/${category}`);
  }

  public editMeatDetails(meatDetails: ProductWithMeatDetails[]): Observable<ProductWithMeatDetails[]> {
    return this.http.put<ProductWithMeatDetails[]>(this.apiUrl, meatDetails) // Modificar products.
  }

}
