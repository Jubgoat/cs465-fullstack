import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authenticationService = inject(AuthenticationService);
  const isTripChange =
    request.url.startsWith('http://localhost:3000/api/trips') &&
    (request.method === 'POST' || request.method === 'PUT');

  if (!isTripChange || !authenticationService.isLoggedIn()) {
    return next(request);
  }

  const token = authenticationService.getToken();

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};