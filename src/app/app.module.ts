import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { EliminarTareaComponent } from './components/eliminarTareas/eliminar-tarea/eliminar-tarea.component';


import { TareaCardComponent } from './components/tarea-card/tarea-card.component';
import { DatePipe } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InicioComponent } from './views/inicio/inicio.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { LoginComponent } from './views/login/login.component';
import { NewPasswordComponent } from './views/new-password/new-password.component';

// Importa el archivo de configuración de AWS Amplify
import '../aws.config';
import { SignUpComponent } from './views/auth/sign-up/sign-up.component';
import { ConfirmSignUpComponent } from './views/auth/confirm-sign-up/confirm-sign-up.component';
import { ResetPasswordComponent } from './views/auth/reset-password/reset-password.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component'; 



@NgModule({
  declarations: [
    AppComponent,
    EliminarTareaComponent,
    TareaCardComponent,
    CrearComponent,
    TareaCardComponent,
    TareaCardComponent,
    InicioComponent,
    LoginComponent,
    NewPasswordComponent,
    SignUpComponent,
    ConfirmSignUpComponent,
    ResetPasswordComponent,
    ThemeToggleComponent,
    EditarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
