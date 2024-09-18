import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SectorRequest, SectorResponse } from '../models/sector.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sectors`;

  private refreshSectors$ = new BehaviorSubject<void>(undefined);

  public refreshSectors() {
    this.refreshSectors$.next();
  }

  public sectors = toSignal(this.refreshSectors$.pipe(
    switchMap(() => this.getSectors(true))), { initialValue: [] });

  private getSectors(isEnabled: boolean): Observable<SectorResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<SectorResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  public createSector(sector: SectorRequest): Observable<string> {
    return this.http.post(this.apiUrl, sector, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public editSector(id: number, sector: SectorRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, sector, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public deleteOrRecoverSector(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 400:
        return throwError(() => new Error(error.error));
      case 403:
        return throwError(() => new Error("No tienes los permisos para realizar esta acción"));
      case 500:
        return throwError(() => new Error("Ocurrió un error en el servidor"));
      default:
        return throwError(() => new Error("Error"));
    }
  }

}
