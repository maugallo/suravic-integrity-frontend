import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/utils/loader.service';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  if (req.url.includes(environment.apiUrl)) {
    loaderService.showLoader();

    return next(req).pipe(
      finalize(() => loaderService.hideLoader())
    );
  }

  return next(req);
};
