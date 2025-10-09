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
  // FormGroup for the login form.
  loginForm!: FormGroup;
  // State variables for displaying messages and loading spinner.
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the login form with its controls and validations.
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?`~ ]).{8,}$")
      ]]
    });
  }

  // Getter for easy access to form controls in the template.
  get errorControl() {
    return this.loginForm.controls;
  }

  /**
   * Handles the user login process.
   * Calls the AuthService to authenticate the user.
   */
  async userLogin() {
    if (this.loginForm.invalid) {
      this.mensajeError = 'Por favor, ingresa un email y contraseña válidos.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.userSignIn(email, password);
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);
      
      let errorMessage = 'Ha ocurrido un error al iniciar sesión. Por favor, inténtalo de nuevo.';
      if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Tu cuenta no ha sido confirmada. Por favor, revisa tu correo electrónico para el código de verificación.';
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

  /**
   * Navigates to the sign-up page.
   */
  goToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
}