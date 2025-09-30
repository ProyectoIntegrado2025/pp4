import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authServices/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  regForm!: FormGroup;
  cargando = false;
  mensajeError: string | null = null;
  mensajeExito: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?`~ ]).{8,}$")
      ]]
    });
  }

  get errorControl() {
    return this.regForm.controls;
  }

  async registerUser() {
    this.cargando = true;
    this.mensajeError = null;
    this.mensajeExito = null;

    if (this.regForm.invalid) {
      this.cargando = false;
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    try {
      await this.authService.userSignUp(this.regForm.value.email, this.regForm.value.password);
      this.mensajeExito = 'Se ha enviado un código de confirmación a tu correo electrónico. Por favor, confírmalo para iniciar sesión.';
      this.router.navigate(['/confirm-sign-up', this.regForm.value.email]);
    } catch (error: any) {
      console.error('Error de registro con Amplify:', error);
      let errorMessage = 'Ha ocurrido un error al registrar el usuario. Por favor, inténtalo de nuevo.';
      if (error.name === 'UsernameExistsException') {
        errorMessage = 'Este correo electrónico ya está registrado. Por favor, inicia sesión o intenta con otro correo.';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Contraseña inválida. Asegúrate de que cumple con los requisitos: al menos 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.';
      } else if (error.name === 'CodeDeliveryFailureException') {
        errorMessage = 'No se pudo enviar el código de verificación. Por favor, verifica tu email.';
      }
      this.mensajeError = errorMessage;
    } finally {
      this.cargando = false;
    }
  }
}
