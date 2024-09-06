import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/utils/token.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return tokenService.getToken().pipe(
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
