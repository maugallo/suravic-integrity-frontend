import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = async (route, state) => {

  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = await tokenService.getToken();

  if (token) {
    if (state.url === '/welcome' || state.url === '/login' || state.url === '/forgot-password') {
      router.navigate(['home']);
    }
    return true;
  } else {
    if (state.url !== '/welcome' && state.url !== '/login' && state.url !== '/forgot-password') {
      router.navigate(['welcome']);
      return false;
    }
    return true;
  }
};
