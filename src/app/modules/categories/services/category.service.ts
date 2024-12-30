import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryRequest, CategoryResponse } from '../models/category.model';
import { BaseService } from 'src/app/shared/models/base-service.model';
import { SectorResponse } from '../../sectors/models/sector.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService implements BaseService<CategoryRequest, CategoryResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/categories`;

  public getEntities(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.apiUrl);
  }

  public createEntity(category: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<SectorResponse>(this.apiUrl, category);
  }

  public editEntity(id: number, category: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<SectorResponse>(`${this.apiUrl}/${id}`, category); // Modificar products.
  }

  public deleteEntity(id: number): Observable<CategoryResponse> {
    return this.http.delete<SectorResponse>(`${this.apiUrl}/${id}`); // Modificar products.
  }

}
