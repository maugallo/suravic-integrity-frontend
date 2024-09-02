import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../models/user.model';
import { HeadersService } from './headers.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private headersService = inject(HeadersService);
  private apiUrl = environment.apiUrl;

  public getUsers(): Observable<UserResponse[]> {
    const headers = this.headersService.getTokenHeader();

    return this.http.get<UserResponse[]>(`${this.apiUrl}/users`, { headers });
  }

}
