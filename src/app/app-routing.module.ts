import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EliminarTareaComponent } from './components/eliminarTareas/eliminar-tarea/eliminar-tarea.component';
import { InicioComponent } from './views/inicio/inicio.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { LoginComponent } from './views/login/login.component';
import { NewPasswordComponent } from './views/new-password/new-password.component';
import {SplashScreenComponent} from './components/splash-screen/splash-screen.component';

import { AuthGuard } from './guards/auth.guard';
import { wildcardRedirectGuard } from './guards/wildcard-redirect.guard';
import { SignUpComponent } from './views/auth/sign-up/sign-up.component';
import { ConfirmSignUpComponent } from './views/auth/confirm-sign-up/confirm-sign-up.component';
import { ResetPasswordComponent } from './views/auth/reset-password/reset-password.component';
import { NotFoundComponent } from './components/not-found.component';
import { ChatAssistantComponent } from './components/chat-assistant/chat-assistant.component';
import { LandingComponent } from './views/landing/landing.component'; //landing
import { CalendarioComponent } from './views/calendario/calendario.component';

const routes: Routes = [
  //{ path: '**', redirectTo: 'login', pathMatch: 'full' },
  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LandingComponent }, // Página principal,
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { authRequired: false } },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard], data: { authRequired: false } },
  { path: 'confirm-sign-up/:email', component: ConfirmSignUpComponent, canActivate: [AuthGuard], data: { authRequired: false } },
  { path: 'reset-password', component: ResetPasswordComponent,canActivate: [AuthGuard], data: { authRequired: false } },
  { path: 'splash', component: SplashScreenComponent, canActivate: [AuthGuard], data: { authRequired: true } },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard], data: { authRequired: true } },
  { path: 'mis-tareas', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'crear', component: CrearComponent, canActivate: [AuthGuard], data: { authRequired: true } }, 
  { path: '__dev/crear',  component: CrearComponent }, /* Para acceder desde el front directamente, borrar al finalizar */
  { path: 'editar/:id', component: EditarComponent, canActivate: [AuthGuard], data: { authRequired: true } }, 
  { path: 'eliminar', component: EliminarTareaComponent, canActivate: [AuthGuard], data: { authRequired: true } }, 
  //{ path: 'newPasswordRequired', component: NewPasswordComponent },
  { path: 'chat-assistant', component: ChatAssistantComponent, canActivate: [AuthGuard], data: { authRequired: true}},
  { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard], data: { authRequired: true}},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
