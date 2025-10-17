import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authServices/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  cargando = false;
  mensajeError = '';

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
          Validators.pattern('[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?`~ ]).{8,}$'
          ),
        ],
      ],
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
      const result = await this.authService.userSignIn(email, password);

      if (result.isSignedIn) {
        // ✅ Si el inicio de sesión es exitoso, redirigimos al inicio
        this.router.navigateByUrl('/inicio');
      }

    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);

      let mensaje = 'Ha ocurrido un error al iniciar sesión. Por favor, inténtalo de nuevo.';
      switch (error.name) {
        case 'NotAuthorizedException':
          mensaje = 'Credenciales incorrectas. Verifica tu email y contraseña.';
          break;
        case 'UserNotConfirmedException':
          mensaje = 'Tu cuenta no ha sido confirmada. Revisa tu correo electrónico.';
          break;
        case 'UserNotFoundException':
          mensaje = 'El email no está registrado. Por favor, regístrate.';
          break;
        case 'LimitExceededException':
          mensaje = 'Demasiados intentos. Espera unos minutos e inténtalo nuevamente.';
          break;
      }
      this.mensajeError = mensaje;
    } finally {
      this.cargando = false;
    }
  }

  /** 🔹 Navegar al registro */
  goToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
}
