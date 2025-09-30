import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
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
