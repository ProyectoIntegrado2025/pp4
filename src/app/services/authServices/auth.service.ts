// src/app/services/auth/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
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
  fetchUserAttributes,
  signInWithRedirect
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
    Hub.listen('auth', ({ payload }) => {
      this.ngZone.run(() => {
        switch (payload.event) {
          case 'signedIn':
            this._isAuthenticated.next(true);
            this.updateAuthenticatedUser();
            this.router.navigateByUrl('/inicio', { replaceUrl: true }).catch(error => {
              console.error('ERROR de navegación a /inicio (Hub signedIn):', error);
            });
            break;
          case 'signedOut':
            this._isAuthenticated.next(false);
            this._authenticatedUser.next(null);
            this.router.navigateByUrl('/login', { replaceUrl: true });
            break;
          case 'signInWithRedirect_failure':
            this._isAuthenticated.next(false);
            this._authenticatedUser.next(null);
            this.router.navigateByUrl('/login', { replaceUrl: true });
            break;
          case 'signInWithRedirect':
            break;
          default:
            break;
        }
      });
    });
    this.checkAuthState();
  }

  async checkAuthState() {
    try {
      const { tokens } = await fetchAuthSession();
      this.ngZone.run(() => {
        if (tokens && tokens.accessToken) {
          this._isAuthenticated.next(true);
          this.updateAuthenticatedUser();
          if (
            this.router.url.startsWith('/login') ||
            this.router.url.startsWith('/sign-up') ||
            this.router.url.startsWith('/reset-password') ||
            this.router.url.startsWith('/auth/confirm-sign-up')
          ) {
            this.router.navigateByUrl('/inicio', { replaceUrl: true }).catch(error => {
              console.error('ERROR de navegación a /inicio (checkAuthState):', error);
            });
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
    } catch (error) {
      this.ngZone.run(() => {
        this._isAuthenticated.next(false);
        this._authenticatedUser.next(null);
        console.error('AuthService: Error al verificar sesión o no hay sesión:', error);
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
    } catch (error) {
      console.error('AuthService: Error al obtener y actualizar info de usuario autenticado:', error);
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
    console.log('AuthService: Iniciando proceso de signOut().');
    try {
      await signOut();
      this._authenticatedUser.next(null);
      console.log('AuthService: signOut() completado exitosamente.');
    } catch (error: any) {
      console.error('AuthService: Error durante signOut():', error);
      throw error;
    }
  }

  async userSignUp(email: string, password: string): Promise<any> {
    try {
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
    } catch (error) {
      console.error('Error in userSignUp:', error);
      throw error;
    }
  }

  async userConfirmSignUp(username: string, code: string): Promise<any> {
    try {
      const result = await confirmSignUp({ username: username, confirmationCode: code });
      return result;
    } catch (error) {
      console.error('Error in userConfirmSignUp:', error);
      throw error;
    }
  }

  async resendSignUpCode(username: string): Promise<any> {
    try {
      const result = await resendSignUpCode({ username: username });
      return result;
    } catch (error) {
      console.error('Error in resendSignUpCode:', error);
      throw error;
    }
  }

  async userResetPassword(username: string): Promise<any> {
    try {
      const result = await resetPassword({ username: username });
      return result;
    } catch (error) {
      console.error('Error in userResetPassword:', error);
      throw error;
    }
  }

  async userConfirmResetPassword(username: string, confirmationCode: string, newPassword: string): Promise<any> {
    try {
      const result = await confirmResetPassword({ username: username, confirmationCode: confirmationCode, newPassword: newPassword });
      return result;
    } catch (error) {
      console.error('Error in userConfirmResetPassword:', error);
      throw error;
    }
  }

  // === TOKENS ===

  async getIdToken(): Promise<string | null> {
    try {
      const { tokens } = await fetchAuthSession();
      return tokens?.idToken?.toString() ?? null;
    } catch (e) {
      console.error('Error obteniendo ID Token:', e);
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const { tokens } = await fetchAuthSession();
      return tokens?.accessToken?.toString() ?? null;
    } catch (e) {
      console.error('Error obteniendo Access Token:', e);
      return null;
    }
  }

async debugPrintTokens(): Promise<void> {
  try {
    const session = await fetchAuthSession();
    console.log('🧩 Sesión completa:', session);

    if (session?.tokens) {
      alert('🔐 Access Token:\n' + session.tokens.accessToken?.toString());

      console.log('🧩 ID Token:', session.tokens.idToken?.toString());
    } else {
      console.warn('⚠️ No hay tokens en la sesión.');
    }
  } catch (e) {
    console.error('Error al obtener tokens:', e);
  }
}


}


