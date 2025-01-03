import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { StorageType } from '../services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const storageService = inject(StorageService);

  return storageService.getStorage(StorageType.TOKEN).pipe(
    map((token) => {
      if (token) {
        if (state.url === '/welcome' || state.url === '/login' || state.url === '/forgot-password') {
          router.navigate(['tabs', 'home']);
          return false;
        }
        return true;
      } else {
        if (state.url !== '/welcome' && state.url !== '/login' && state.url !== '/forgot-password') {
          router.navigate(['welcome']);
          return false;
        }
        return true;
      }
    })
  );
};
