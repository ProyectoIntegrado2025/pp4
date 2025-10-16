import { Injectable } from '@angular/core';
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  fetchAuthSession,
  signOut,
  getCurrentUser,
} from 'aws-amplify/auth';
import { BehaviorSubject } from 'rxjs';

export interface AuthenticatedUser {
  username: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authenticatedUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);
  authenticatedUser$ = this._authenticatedUser$.asObservable();

  constructor() {
    this.checkUser();
  }

  /** 🔹 Verifica si hay un usuario logueado al iniciar */
  async checkUser() {
    try {
      const user = await getCurrentUser();
      this._authenticatedUser$.next({
        username: user.username,
        email: user.signInDetails?.loginId,
      });
    } catch {
      this._authenticatedUser$.next(null);
    }
  }

  /** 🔹 Sign Up */
  async userSignUp(email: string, password: string): Promise<any> {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      return { isSignUpComplete, userId, nextStep };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /** 🔹 Confirm Sign Up */
  async userConfirmSignUp(email: string, code: string): Promise<any> {
    try {
      const result = await confirmSignUp({ username: email, confirmationCode: code });
      return result;
    } catch (error) {
      console.error('Error al confirmar registro:', error);
      throw error;
    }
  }

  /** 🔹 Reenviar código de confirmación */
  async resendSignUpCode(email: string): Promise<any> {
    try {
      const result = await resendSignUpCode({ username: email });
      return result;
    } catch (error) {
      console.error('Error al reenviar código:', error);
      throw error;
    }
  }

  /** 🔹 Login */
  async userSignIn(email: string, password: string): Promise<any> {
    try {
      const user = await signIn({ username: email, password });
      await this.checkUser();
      return user;
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw error;
    }
  }

  /** 🔹 Reset Password */
  async userResetPassword(email: string): Promise<any> {
    try {
      const result = await resetPassword({ username: email });
      return result;
    } catch (error) {
      console.error('Error en reset password:', error);
      throw error;
    }
  }

  /** 🔹 Confirmar nuevo password */
  async userConfirmResetPassword(email: string, code: string, newPassword: string): Promise<any> {
    try {
      const result = await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      return result;
    } catch (error) {
      console.error('Error confirmando nueva contraseña:', error);
      throw error;
    }
  }

  /** 🔹 Verifica si hay sesión activa */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { tokens } = await fetchAuthSession();
      return !!tokens?.idToken;
    } catch {
      return false;
    }
  }

  /** 🔹 Cierra sesión */
  async logout(): Promise<void> {
    try {
      await signOut();
      this._authenticatedUser$.next(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /** 🔹 Obtiene el ID Token */
  async getIdToken(): Promise<string | null> {
    try {
      const { tokens } = await fetchAuthSession();
      return tokens?.idToken?.toString() ?? null;
    } catch (e) {
      console.error('Error obteniendo ID Token:', e);
      return null;
    }
  }

  /** 🔹 Obtiene el Access Token */
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