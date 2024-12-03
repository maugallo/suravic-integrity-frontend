import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/attendances`;

  public checkAttendance(faceImageData: FormData): Observable<string> {
    return this.http.post(this.apiUrl, faceImageData, { responseType: 'text' })
      .pipe(catchError((error) => this.handleError(error)))
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.message));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error(error.message));
      default:
        return throwError(() => "No se pudo reconocer el rostro, inténtalo nuevamente");
    }
  }

}
