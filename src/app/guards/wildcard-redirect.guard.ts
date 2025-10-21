
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/authServices/auth.service';
import { filter, map, take } from 'rxjs/operators';

export const wildcardRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated.pipe(
    // si inicias con null, filtra hasta true/false real; si inicias en false, podés quitar este filter
    filter((v): v is boolean => v !== null && v !== undefined),
    take(1),
    map(isAuth => isAuth
      ? router.createUrlTree(['/inicio'])
      : router.createUrlTree(['/login'])
    )
  );
};
