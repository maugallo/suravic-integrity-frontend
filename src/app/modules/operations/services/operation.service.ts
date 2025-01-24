import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OperationResponse } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/operations`;

  public getEntities(accountId: number): Observable<OperationResponse[]> {
    return this.http.get<OperationResponse[]>(`${this.apiUrl}/${accountId}`);
  }

  public createEntity(operation: FormData): Observable<OperationResponse> {
    return this.http.post<OperationResponse>(this.apiUrl, operation);
  }

  public editEntity(id: number, operation: FormData): Observable<OperationResponse> {
    return this.http.put<OperationResponse>(`${this.apiUrl}/${id}`, operation);
  }

  public deleteEntity(id: number): Observable<OperationResponse> {
    return this.http.delete<OperationResponse>(`${this.apiUrl}/${id}`);
  }

  public getReceiptFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/receipt`, { responseType: 'blob' });
  }

}
