import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';
import { AuthService } from '../services/authServices/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const authRequired = route.data['authRequired'] !== false;

    return this.authService.isAuthenticated.pipe(
      filter((v): v is boolean => v !== null), // espera hasta true/false real
      take(1),
      map(isAuthenticated => {
        if (authRequired) {
          if (isAuthenticated) {
            return true;
          } else {
            return this.router.createUrlTree(['/login']);
          }
        } else {
          if (isAuthenticated) {
            return this.router.createUrlTree(['/inicio']);
          } else {
            return true;
          }
        }
      })
    );
  }
}