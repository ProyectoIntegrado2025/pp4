import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../services/cognito.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  currentpassword: string = '';
  cognitoUser: any = null;
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
    // Intentamos tomar el objeto enviado por router.navigate(..., { state: { ... } })
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any | undefined;

    if (state?.cognitoUser) {
      // Si venimos directamente desde login:
      this.cognitoUser = state.cognitoUser;
      this.userAttributes = state.userAttributes || {};
      this.requiredAttributes = state.requiredAttributes || {};
    } else {
      // Fallback: si el service mantiene la referencia (app no recargada), usarla
      this.cognitoUser = this.authService.cognitoUser;
      // Si el service guardara attrs podrías solicitarlos aquí; por ahora dejamos {}
      this.userAttributes = {};
      this.requiredAttributes = {};
    }

    if (!this.cognitoUser) {
      this.mensaje = 'No hay sesión activa para completar el cambio de contraseña. Por favor volvé a iniciar sesión con la contraseña temporal.';
      console.warn(this.mensaje);
      // Opcional: redirigir al login automáticamente:
      // setTimeout(() => this.router.navigate(['/login']), 2000);
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

    // Llamada al SDK directamente sobre el objeto cognitoUser recibido
    this.cognitoUser.completeNewPasswordChallenge(
      this.newPassword,
      this.userAttributes || {},
      {
        onSuccess: (result: any) => {
          this.cargando = false;
          this.mensaje = 'Contraseña cambiada con éxito. Redirigiendo al login...';
          console.log('Reset Success', result);
          // ir a login (o a donde quieras)
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

