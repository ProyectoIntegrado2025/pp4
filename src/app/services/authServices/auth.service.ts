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
  fetchUserAttributes,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export interface AuthenticatedUser {
  userId: string | null;
  email: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean| null>(null);
  isAuthenticated = this._isAuthenticated.asObservable();

  private _authenticatedUser = new BehaviorSubject<AuthenticatedUser | null>(null);
  authenticatedUser$: Observable<AuthenticatedUser | null> = this._authenticatedUser.asObservable();

  constructor(private router: Router, private ngZone: NgZone) {
    // Escucha global de eventos de autenticación de Amplify
    Hub.listen('auth', ({ payload }) => {
      this.ngZone.run(() => {
        switch (payload.event) {
          case 'signedIn':
            this._isAuthenticated.next(true);
            this.updateAuthenticatedUser();
            //this.router.navigateByUrl('/inicio', { replaceUrl: true }).catch(() => {});
            break;

          case 'signedOut':
            this._isAuthenticated.next(false);
            this._authenticatedUser.next(null);
           // this.router.navigateByUrl('/login', { replaceUrl: true }).catch(() => {});
            break;

          default:
            break;
        }
      });
    });

   // setTimeout(() => this.checkAuthState(), 800);
   this.checkAuthState();
  }

  /** 🔹 Verifica si hay sesión activa */
  async checkAuthState() {
    try {
      const session = await fetchAuthSession();
      const tokens = session?.tokens;

      this.ngZone.run(() => {
        if (tokens?.accessToken) {
          this._isAuthenticated.next(true);
          this.updateAuthenticatedUser();
        } else {
          this._isAuthenticated.next(false);
          this._authenticatedUser.next(null);
        }
      });
    } catch {
      this._isAuthenticated.next(false);
      this._authenticatedUser.next(null);
    }
  }

  /** 🔹 Actualiza los datos del usuario autenticado */
  private async updateAuthenticatedUser(): Promise<void> {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      this._authenticatedUser.next({
        userId: user.userId,
        email: attributes.email || null,
      });
    } catch {
      this._authenticatedUser.next(null);
    }
  }

  /** 🔹 Registro de usuario */
  async userSignUp(email: string, password: string): Promise<any> {
    return await signUp({
      username: email,
      password,
      options: { userAttributes: { email } },
    });
  }

  /** 🔹 Confirmar registro */
  async userConfirmSignUp(email: string, code: string): Promise<any> {
    return await confirmSignUp({ username: email, confirmationCode: code });
  }

  /** 🔹 Reenviar código de confirmación */
  async resendSignUpCode(email: string): Promise<any> {
    return await resendSignUpCode({ username: email });
  }

  /** 🔹 Inicio de sesión */
  async userSignIn(email: string, password: string): Promise<any> {
    const result = await signIn({ username: email, password });
    if (result.isSignedIn) {
      this.updateAuthenticatedUser();
    }
    return result;
  }

  /** 🔹 Resetear contraseña */
  async userResetPassword(email: string): Promise<any> {
    return await resetPassword({ username: email });
  }

  /** 🔹 Confirmar nueva contraseña */
  async userConfirmResetPassword(email: string, code: string, newPassword: string): Promise<any> {
    return await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
  }

/** 🔹 Cerrar sesión */
async logout(): Promise<void> {
  try {
    await signOut(); // Cierra sesión en Cognito y Amplify

    // 🔹 Limpieza adicional: elimina cualquier token o dato residual
    localStorage.clear();
    sessionStorage.clear();

    // 🔹 Actualiza estados locales
    this._authenticatedUser.next(null);
    this._isAuthenticated.next(false);

    // 🔹 Redirige al login
    this.ngZone.run(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true }).catch(() => {});
    });

    console.log('✅ Sesión cerrada y almacenamiento limpiado.');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}


  /** 🔹 Obtener ID Token */
  async getIdToken(): Promise<string | null> {
    try {
      const { tokens } = await fetchAuthSession();
      return tokens?.idToken?.toString() ?? null;
    } catch (e) {
      console.error('Error obteniendo ID Token:', e);
      return null;
    }
  }

  /** 🔹 Obtener Access Token */
  async getAccessToken(): Promise<string | null> {
    try {
      const { tokens } = await fetchAuthSession();
      return tokens?.accessToken?.toString() ?? null;
    } catch (e) {
      console.error('Error obteniendo Access Token:', e);
      return null;
    }
  }
}
