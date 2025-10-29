import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authServices/auth.service';

@Component({
  selector: 'app-confirm-sign-up',
  templateUrl: './confirm-sign-up.component.html',
  styleUrls: ['./confirm-sign-up.component.css']
})
export class ConfirmSignUpComponent implements OnInit {

  confirmForm!: FormGroup;
  email: string = '';
  cargando: boolean = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.confirmForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const passedEmail = params.get('email');
      if (passedEmail) {
        this.email = passedEmail;
        this.confirmForm.get('email')?.setValue(passedEmail);
      }
    });
  }

  get errorControl() {
    return this.confirmForm.controls;
  }

  async confirmSignUp() {
    this.cargando = true;
    this.mensajeError = null;
    this.mensajeExito = null;

    if (this.confirmForm.invalid) {
      this.mensajeError = 'Por favor, ingresa un correo electrónico válido y el código de 6 dígitos.';
      this.cargando = false;
      return;
    }

    const { email, code } = this.confirmForm.value;

    try {
      await this.authService.userConfirmSignUp(email, code);
      this.mensajeExito = '¡Tu cuenta ha sido confirmada exitosamente! Ya puedes iniciar sesión.';
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error: any) {
      console.error('Error al confirmar registro:', error);
      let errorMessage = 'Ha ocurrido un error al confirmar tu cuenta. Por favor, inténtalo de nuevo.';

      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Código de confirmación incorrecto. Verifica el código que recibiste en tu correo.';
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = 'El código de confirmación ha expirado. Por favor, solicita uno nuevo.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'Usuario no encontrado. Asegúrate de que el correo electrónico es correcto.';
      } else if (error.name === 'LimitExceededException') {
        errorMessage = 'Demasiados intentos. Por favor, espera y vuelve a intentarlo.';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Este usuario ya ha sido confirmado. Por favor, inicia sesión.';
      }
      this.mensajeError = errorMessage;
    } finally {
      this.cargando = false;
    }
  }

  async resendCode() {
    this.mensajeError = null;
    this.mensajeExito = null;

    if (this.confirmForm.get('email')?.invalid) {
      this.mensajeError = 'Por favor, ingresa un correo electrónico válido para reenviar el código.';
      return;
    }

    const email = this.confirmForm.value.email;
    this.cargando = true;

    try {
      await this.authService.resendSignUpCode(email);
      this.mensajeExito = 'Se ha enviado un nuevo código de confirmación a tu correo electrónico.';
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      let errorMessage = 'No se pudo reenviar el código. Asegúrate de que el correo es correcto y la cuenta existe.';
      if (error.name === 'UserNotFoundException') {
        errorMessage = 'Usuario no encontrado. Asegúrate de que el correo electrónico es correcto.';
      } else if (error.name === 'LimitExceededException') {
        errorMessage = 'Has solicitado demasiados códigos. Por favor, espera unos minutos antes de intentarlo de nuevo.';
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Correo electrónico no válido o cuenta ya confirmada. Por favor, verifica tu email.';
      }
      this.mensajeError = errorMessage;
    } finally {
      this.cargando = false;
    }
  }
}

