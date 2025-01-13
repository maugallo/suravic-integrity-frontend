import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DayOffRequest, DayOffResponse } from '../models/day-off.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class DayOffService implements BaseService<DayOffRequest, DayOffResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/days-off`;

  public getEntities(): Observable<DayOffResponse[]> {
    return this.http.get<DayOffResponse[]>(this.apiUrl);
  }

  public createEntity(dayOff: DayOffRequest): Observable<DayOffResponse> {
    return this.http.post<DayOffResponse>(this.apiUrl, dayOff);
  }

  public editEntity(id: number, dayOff: DayOffRequest): Observable<DayOffResponse> {
    return this.http.put<DayOffResponse>(`${this.apiUrl}/${id}`, dayOff);
  }

  public deleteEntity(id: number): Observable<DayOffResponse> {
    return this.http.delete<DayOffResponse>(`${this.apiUrl}/${id}`);
  }

}
