import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRequest, UserResponse } from '../models/user.model';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BaseService } from 'src/app/shared/models/base-service.model';

@Injectable({
  providedIn: 'root'
})
export class UserService implements BaseService<UserRequest, UserResponse> {

  private errorService = inject(ErrorService);
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  public getEntities(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl)
      .pipe(catchError(this.errorService.handleError));
  }

  public createEntity(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl, user)
      .pipe(catchError(this.errorService.handleError));
  }

  public editEntity(id: number, user: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, user)
      .pipe(catchError(this.errorService.handleError));
  }

  public deleteEntity(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.errorService.handleError));
  }

}
