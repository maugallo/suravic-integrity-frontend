import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryRequest, CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  private refreshCategories$ = new BehaviorSubject<void>(undefined);

  public refreshCategories() {
    this.refreshCategories$.next();
  }

  public categories = toSignal(this.refreshCategories$.pipe(
    switchMap(() => this.getCategories(true))), { initialValue: [] });

  private getCategories(isEnabled: boolean): Observable<CategoryResponse[]> {
    let params = new HttpParams();

    params = params.append('isEnabled', isEnabled);

    return this.http.get<CategoryResponse[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  public createCategory(category: CategoryRequest): Observable<string> {
    return this.http.post(this.apiUrl, category, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public editCategory(id: number, category: CategoryRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, category, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public deleteOrRecoverCategory(id: number): Observable<string> {
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
