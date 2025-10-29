import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authServices/auth.service';

/**
 * Validador personalizado para comprobar que los campos de contraseña y confirmación coincidan.
 */
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  // Solo validar si ambos campos existen y tienen valor
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    // Retorna el error 'passwordMismatch' en el FormGroup
    return { 'passwordMismatch': true };
  }
  return null;
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  // Formulario para el Paso 1: Solicitud de código
  resetForm: FormGroup;
  
  // Formulario para el Paso 2: Confirmación de código y nueva contraseña
  confirmForm: FormGroup;
  
  // Estados de la UI
  mostrarFormularioConfirmacion: boolean = false;
  cargando: boolean = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  // Regex para validación de email y contraseña (consistente con el servicio de Cognito)
  // Contraseña: Min 8 chars, al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicialización de FormGroups en el constructor
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.confirmForm = this.formBuilder.group({
      // El valor inicial es una cadena vacía, pero se deshabilita el control aquí
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], 
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      // Aplicar el validador personalizado a todo el FormGroup de confirmación
      validator: passwordMatchValidator
    });
  }

  ngOnInit() {
    this.mensajeError = null;
    this.mensajeExito = null;
  }

  // Getters para fácil acceso a los errores de validación
  get errorControlReset() {
    return this.resetForm.controls;
  }

  get errorControlConfirm() {
    return this.confirmForm.controls;
  }

  /**
   * Paso 1: Envía la solicitud de restablecimiento de contraseña (pide el código).
   * @param reenvio Indica si es un reenvío (true) o la primera solicitud (false/undefined).
   */
  async sendCode(reenvio: boolean = false) { 
    this.mensajeError = null;
    this.mensajeExito = null;
    this.cargando = true;
    
    const email = reenvio ? this.confirmForm.get('email')?.value : this.resetForm.value.email;

    if (!email) {
      this.mensajeError = 'Debe ingresar un correo electrónico.';
      this.cargando = false;
      return;
    }
    
    if (!reenvio && this.resetForm.invalid) {
      this.cargando = false;
      return;
    }

    try {
      await this.authService.userResetPassword(email);
      
      if (!reenvio) {
        this.mostrarFormularioConfirmacion = true;
        this.confirmForm.get('email')?.setValue(email);
      }

      if (reenvio) {
        this.mensajeExito = '¡Código reenviado con éxito! Por favor revisa tu correo.';
        setTimeout(() => this.mensajeExito = null, 3000);
      } else {
        this.mensajeExito = 'Código de verificación enviado a tu correo electrónico.';
        setTimeout(() => this.mensajeExito = null, 3000);
      }

    } catch (error: any) {
      this.mensajeError = this.handleCognitoError(error.name);
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Paso 2: Confirma el código y establece la nueva contraseña.
   */
  async confirmNewPassword() {
    this.mensajeError = null;
    this.mensajeExito = null;
    this.cargando = true;

    if (this.confirmForm.invalid) {
      this.cargando = false;
      return;
    }
    
    const { code, newPassword } = this.confirmForm.getRawValue();
    // Obtenemos el email usando getRawValue() o get('email')?.value ya que está deshabilitado
    const email = this.confirmForm.get('email')?.value; 

    try {
      await this.authService.userConfirmResetPassword(email, code, newPassword);

      this.mensajeExito = '¡Contraseña restablecida con éxito! Serás redirigido al inicio de sesión.';
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);

    } catch (error: any) {
      this.mensajeError = this.handleCognitoError(error.name);
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Mapea los errores de Cognito a mensajes amigables para el usuario.
   */
  private handleCognitoError(errorName: string): string {
    switch (errorName) {
      case 'UserNotFoundException':
        return 'Error: El correo electrónico no está registrado.';
      case 'CodeMismatchException':
        return 'Error: El código de verificación es incorrecto.';
      case 'ExpiredCodeException':
        return 'Error: El código de verificación ha expirado. Por favor, solicita uno nuevo.';
      case 'InvalidPasswordException':
        return 'Error: La nueva contraseña no cumple con los requisitos de seguridad.';
      case 'LimitExceededException':
        return 'Error: Has intentado demasiadas veces. Intenta de nuevo más tarde.';
      default:
        return 'Error desconocido. Por favor, intenta de nuevo.';
    }
  }
}
