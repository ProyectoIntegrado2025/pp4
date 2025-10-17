import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/authServices/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // Si la ruta requiere autenticación (por defecto true)
    const authRequired = route.data['authRequired'] !== false;

    return this.authService.isAuthenticated.pipe(
      take(1),
      map((isAuthenticated) => {
        if (authRequired) {
          // 🔹 Ruta protegida: requiere login
          return isAuthenticated
            ? true
            : this.router.createUrlTree(['/login']);
        } else {
          // 🔹 Ruta pública: redirigir si ya está logueado
          return isAuthenticated
            ? this.router.createUrlTree(['/inicio'])
            : true;
        }
      })
    );
  }
}
