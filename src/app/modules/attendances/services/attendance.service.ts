import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/attendances`;

  public markAttendance(faceImageData: FormData): Observable<string> {
    return this.http.post(this.apiUrl, faceImageData, { responseType: 'text' });
  }

}
