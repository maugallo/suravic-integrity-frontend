import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/reports`;

  public getEmployeesReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/employees`, { responseType: 'blob' });
  }

  public getAttendancesReport(month: ChosenMonth): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/attendances?month=${month}`, { responseType: 'blob' });
  }

  public getTicketsReport(employeeId: number, month: ChosenMonth): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/tickets/${employeeId}?month=${month}`, { responseType: 'blob' });
  }

  public getPayAdvancesReport(employeeId: number, month: ChosenMonth): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pay-advances/${employeeId}?month=${month}`, { responseType: 'blob' });
  }

  public getDebtsReport() {
    return this.http.get(`${this.apiUrl}/debts`, { responseType: 'blob' });
  }

}

export enum ChosenMonth {
  CURRENT = 'current',
  LAST = 'last'
}