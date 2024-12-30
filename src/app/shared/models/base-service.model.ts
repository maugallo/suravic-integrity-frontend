import { Observable } from "rxjs";

export interface BaseService<TRequest, TResponse> {
    getEntities(): Observable<TResponse[]>,

    createEntity(entity: TRequest): Observable<TResponse>,

    editEntity(id: number, entity: TRequest): Observable<TResponse>,
    
    deleteEntity(id: number): Observable<TResponse>
}