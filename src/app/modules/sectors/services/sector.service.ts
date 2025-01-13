import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SectorRequest, SectorResponse } from '../models/sector.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class SectorService implements BaseService<SectorRequest, SectorResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/sectors`;

  public getEntities(): Observable<SectorResponse[]> {
    return this.http.get<SectorResponse[]>(this.apiUrl);
  }

  public createEntity(sector: SectorRequest): Observable<SectorResponse> {
    return this.http.post<SectorResponse>(this.apiUrl, sector);
  }

  public editEntity(id: number, sector: SectorRequest): Observable<SectorResponse> {
    return this.http.put<SectorResponse>(`${this.apiUrl}/${id}`, sector);
  }

  public deleteEntity(id: number): Observable<SectorResponse> {
    return this.http.delete<SectorResponse>(`${this.apiUrl}/${id}`);
  }

}
