import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeRequest, EmployeeResponse } from '../models/employee.model';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements BaseService<EmployeeRequest, EmployeeResponse> {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/employees`;

  public getEntities(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(this.apiUrl);
  }

  public createEntity(employee: EmployeeRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.apiUrl, employee);
  }

  public editEntity(id: number, employee: EmployeeRequest): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(`${this.apiUrl}/${id}`, employee);
  }

  public deleteEntity(id: number): Observable<EmployeeResponse> {
    return this.http.delete<EmployeeResponse>(`${this.apiUrl}/${id}`);
  }

  public createFaceImage(id: number, faceImageData: FormData): Observable<Blob | undefined> {
    return this.http.post(`${this.apiUrl}/${id}/face-image`, faceImageData, { responseType: 'blob' })
      .pipe(map((response) => {
        if (response instanceof Blob && response.size > 0) {
          return response;
        }
        return undefined;
      }));
  }

  public getFaceImageFile(id: number): Observable<Blob | undefined> {
    return this.http.get(`${this.apiUrl}/${id}/face-image`, { responseType: 'blob' })
      .pipe(map((response) => {
        if (response instanceof Blob && response.size > 0 && (response.type === 'image/jpeg' || response.type === 'image/png')) {
          return response;
        }
        return undefined;
      }));
  }

}
