import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authServices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?`~ ]).{8,}$"
          )
        ]
      ]
    });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  /** 🔹 Maneja el inicio de sesión del usuario */
  async userLogin() {
    if (this.loginForm.invalid) {
      this.mensajeError = 'Por favor, ingresa un email y contraseña válidos.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { email, password } = this.loginForm.value;

    try {
      try {
        // 🔹 Intentar iniciar sesión normalmente
        await this.authService.userSignIn(email, password);
        await this.authService.checkUser(); // 🔹 Sincroniza el estado del usuario
      } catch (error: any) {
        // 🔹 Si ya hay un usuario autenticado, sincronizamos sin mostrar error
        if (error.name === 'UserAlreadyAuthenticatedException') {
          console.warn('Usuario ya autenticado, sincronizando sesión...');
          await this.authService.checkUser();
        } else {
          throw error; // 🔹 Otros errores se manejan más abajo
        }
      }

      // ✅ Si todo sale bien, redirigimos al inicio
      this.router.navigateByUrl('/inicio');

    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);

      let errorMessage = 'Ha ocurrido un error al iniciar sesión. Por favor, inténtalo de nuevo.';
      if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Tu cuenta no ha sido confirmada. Revisa tu correo para el código de verificación.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'El email no está registrado. Por favor, regístrate.';
      } else if (error.name === 'LimitExceededException') {
        errorMessage = 'Demasiados intentos. Por favor, espera y vuelve a intentarlo.';
      }

      this.mensajeError = errorMessage;
    } finally {
      this.cargando = false;
    }
  }

  /** 🔹 Navegar al registro */
  goToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
}
