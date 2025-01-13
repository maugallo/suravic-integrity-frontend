import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicHolidayRequest, PublicHolidayResponse } from '../models/public-holiday.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class PublicHolidayService implements BaseService<PublicHolidayRequest, PublicHolidayResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/public-holidays`;

  public getEntities(): Observable<PublicHolidayResponse[]> {
    return this.http.get<PublicHolidayResponse[]>(this.apiUrl);
  }

  public createEntity(publicHoliday: PublicHolidayRequest): Observable<PublicHolidayResponse> {
    return this.http.post<PublicHolidayResponse>(this.apiUrl, publicHoliday);
  }

  public editEntity(id: number, publicHoliday: PublicHolidayRequest): Observable<PublicHolidayResponse> {
    return this.http.put<PublicHolidayResponse>(`${this.apiUrl}/${id}`, publicHoliday);
  }

  public deleteEntity(id: number): Observable<PublicHolidayResponse> {
    return this.http.delete<PublicHolidayResponse>(`${this.apiUrl}/${id}`);
  }

}
