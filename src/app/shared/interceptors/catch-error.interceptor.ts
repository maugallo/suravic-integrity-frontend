import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { catchError } from 'rxjs';

export const catchErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const errorService = inject(ErrorService);

  if (req.url.includes('refresh')) {
    return next(req).pipe(
      catchError((error) => errorService.handleRefreshError(error))
    );
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.error instanceof Blob)
        return errorService.handleBlobError(error.error);
      else
        return errorService.handleError(error);
    })
  );
};
