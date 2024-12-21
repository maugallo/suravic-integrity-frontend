import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProviderRequest, ProviderResponse } from '../models/provider.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService implements BaseService<ProviderRequest, ProviderResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/providers`;

  public getEntities(): Observable<ProviderResponse[]> {
    return this.http.get<ProviderResponse[]>(this.apiUrl);
  }

  public createEntity(provider: ProviderRequest): Observable<ProviderResponse> {
    return this.http.post<ProviderResponse>(this.apiUrl, provider);
  }

  public editEntity(id: number, provider: ProviderRequest): Observable<ProviderResponse> {
    return this.http.put<ProviderResponse>(`${this.apiUrl}/${id}`, provider); // Modificar productStore.
  }

  public deleteEntity(id: number): Observable<ProviderResponse> {
    return this.http.delete<ProviderResponse>(`${this.apiUrl}/${id}`); // Modificar productStore.
  }

}