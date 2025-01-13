import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShiftRequest, ShiftResponse } from '../models/shift.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService implements BaseService<ShiftRequest, ShiftResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/shifts`;

  public getEntities(): Observable<ShiftResponse[]> {
    return this.http.get<ShiftResponse[]>(this.apiUrl);
  }

  public createEntity(shift: ShiftRequest): Observable<ShiftResponse> {
    return this.http.post<ShiftResponse>(this.apiUrl, shift);
  }

  public editEntity(id: number, shift: ShiftRequest): Observable<ShiftResponse> {
    return this.http.put<ShiftResponse>(`${this.apiUrl}/${id}`, shift); // Update employees
  }

  public deleteEntity(id: number): Observable<ShiftResponse> {
    return this.http.delete<ShiftResponse>(`${this.apiUrl}/${id}`);
  }

}
