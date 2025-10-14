// src/app/services/auth/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  signUp,
  signIn,
  confirmSignUp,
  fetchAuthSession,
  signOut,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  fetchUserAttributes
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface AuthenticatedUser {
  userId: string | null;
  email: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated = this._isAuthenticated.asObservable();

  private _authenticatedUser = new BehaviorSubject<AuthenticatedUser | null>(null);
  authenticatedUser$: Observable<AuthenticatedUser | null> = this._authenticatedUser.asObservable();

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {
    // Escucha global de eventos de autenticación de Amplify
    Hub.listen('auth', ({ payload }) => {
      this.ngZone.run(() => {
        switch (payload.event) {
          case 'signedIn':
            this._isAuthenticated.next(true);
            this.updateAuthenticatedUser();
            this.router.navigateByUrl('/inicio', { replaceUrl: true }).catch(() => {});
            break;

          case 'signedOut':
            this._isAuthenticated.next(false);
            this._authenticatedUser.next(null);
            this.router.navigateByUrl('/login', { replaceUrl: true }).catch(() => {});
            break;

          case 'signInWithRedirect_failure':
            this._isAuthenticated.next(false);
            this._authenticatedUser.next(null);
            this.router.navigateByUrl('/login', { replaceUrl: true });
            break;

          default:
            break;
        }
      });
    });

    // Esperar un momento para que Amplify inicialice los tokens antes de validar sesión
    setTimeout(() => {
      this.checkAuthState();
    }, 800);
  }

  async checkAuthState() {
    try {
      const session = await fetchAuthSession();
      const tokens = session?.tokens;

      this.ngZone.run(() => {
        if (tokens && tokens.accessToken) {
          this._isAuthenticated.next(true);
          this.updateAuthenticatedUser();

          const currentRoute = this.router.url;
          if (
            currentRoute.startsWith('/login') ||
            currentRoute.startsWith('/sign-up') ||
            currentRoute.startsWith('/reset-password') ||
            currentRoute.startsWith('/auth/confirm-sign-up')
          ) {
            this.router.navigateByUrl('/inicio', { replaceUrl: true }).catch(() => {});
          }
        } else {
          this._isAuthenticated.next(false);
          this._authenticatedUser.next(null);

          if (
            !this.router.url.startsWith('/login') &&
            !this.router.url.startsWith('/sign-up') &&
            !this.router.url.startsWith('/reset-password') &&
            !this.router.url.startsWith('/auth/confirm-sign-up')
          ) {
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      });
    } catch {
      this.ngZone.run(() => {
        this._isAuthenticated.next(false);
        this._authenticatedUser.next(null);

        if (
          !this.router.url.startsWith('/login') &&
          !this.router.url.startsWith('/sign-up') &&
          !this.router.url.startsWith('/reset-password') &&
          !this.router.url.startsWith('/auth/confirm-sign-up')
        ) {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        }
      });
    }
  }

  private async updateAuthenticatedUser(): Promise<void> {
    try {
      const user = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      this._authenticatedUser.next({
        userId: user.userId,
        email: userAttributes.email || null
      });
    } catch {
      this._authenticatedUser.next(null);
    }
  }

  async userSignIn(email: string, password: string): Promise<any> {
    const result = await signIn({ username: email, password: password });
    if (result.isSignedIn) {
      this.updateAuthenticatedUser();
    }
    return result;
  }

  async logout(): Promise<void> {
    try {
      await signOut();
      this._authenticatedUser.next(null);
    } catch (error: any) {
      throw error;
    }
  }

  async userSignUp(email: string, password: string): Promise<any> {
    const result = await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email: email,
        },
      },
    });
    return result;
  }

  async userConfirmSignUp(username: string, code: string): Promise<any> {
    return await confirmSignUp({ username: username, confirmationCode: code });
  }

  async resendSignUpCode(username: string): Promise<any> {
    return await resendSignUpCode({ username: username });
  }

  async userResetPassword(username: string): Promise<any> {
    return await resetPassword({ username: username });
  }

  async userConfirmResetPassword(username: string, confirmationCode: string, newPassword: string): Promise<any> {
    return await confirmResetPassword({
      username: username,
      confirmationCode: confirmationCode,
      newPassword: newPassword,
    });
  }
}
