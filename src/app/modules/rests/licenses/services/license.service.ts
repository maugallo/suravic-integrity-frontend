import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LicenseRequest, LicenseResponse } from '../models/license.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class LicenseService implements BaseService<LicenseRequest, LicenseResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/licenses`;

  public getEntities(): Observable<LicenseResponse[]> {
    return this.http.get<LicenseResponse[]>(this.apiUrl);
  }

  public createEntity(license: LicenseRequest): Observable<LicenseResponse> {
    return this.http.post<LicenseResponse>(this.apiUrl, license);
  }

  public editEntity(id: number, license: LicenseRequest): Observable<LicenseResponse> {
    return this.http.put<LicenseResponse>(`${this.apiUrl}/${id}`, license);
  }

  public deleteEntity(id: number): Observable<LicenseResponse> {
    return this.http.delete<LicenseResponse>(`${this.apiUrl}/${id}`);
  }

}
