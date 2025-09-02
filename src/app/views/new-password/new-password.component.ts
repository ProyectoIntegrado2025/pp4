import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/cognito.service';
import { CognitoUser } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  currentpassword: string = '';
  cognitoUser: CognitoUser | null = null;
  userAttributes: any = {};
  requiredAttributes: any = {};
  newPassword: string = '';
  confirmPassword: string = '';
  cargando: boolean = false;
  mensaje: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticateService
  ) {}

  ngOnInit(): void {
    // Intentamos tomar los atributos enviados por router.navigate(..., { state: { ... } })
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any | undefined;

    // NOTE: en tu login estás guardando el cognitoUser en el service con setTempUser(this.cognitoUser)
    // y enviando userAttributes/requiredAttributes por state. Por eso aquí:
    // - recuperamos cognitoUser del service (fallback) y
    // - tomamos los atributos del state (si vienen)
    this.userAttributes = state?.userAttributes || {};
    this.requiredAttributes = state?.requiredAttributes || {};

    // recuperamos el cognitoUser desde el service si no vino en el state
    // (no pasamos cognitoUser por state; lo dejamos en temp en el service para evitar pérdida en reload)
    this.cognitoUser = this.authService.getTempUser();

    // Si por algún motivo quisieras permitir obtenerlo desde state si lo pasaras,
    // podrías hacer: this.cognitoUser = state?.cognitoUser || this.authService.getTempUser();

    if (!this.cognitoUser) {
      this.mensaje = 'No hay sesión activa para completar el cambio de contraseña. Por favor volvé a iniciar sesión con la contraseña temporal.';
      console.warn(this.mensaje);
      // Redirigir al login es buena idea si no hay usuario:
      // this.router.navigate(['/login']);
    }
  }

  confirmPasswordReset() {
    if (!this.cognitoUser) {
      this.mensaje = 'No se encontró el usuario. Volvé a iniciar sesión.';
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.mensaje = 'Completá ambos campos de nueva contraseña.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.mensaje = "Las contraseñas no coinciden.";
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    // Llamada al SDK directamente sobre el objeto cognitoUser recuperado del service
    this.cognitoUser.completeNewPasswordChallenge(
      this.newPassword,
      this.userAttributes || {},
      {
        onSuccess: (result: any) => {
          this.cargando = false;
          this.mensaje = 'Contraseña cambiada con éxito. Redirigiendo al login...';
          console.log('Reset Success', result);
          // limpiar temp user por seguridad
          this.authService.setTempUser(null as any);
          this.router.navigate(['/login']);
        },
        onFailure: (err: any) => {
          this.cargando = false;
          console.error('Reset Fail', err);
          this.mensaje = err?.message || 'Error al cambiar la contraseña.';
        }
      }
    );
  }
}

