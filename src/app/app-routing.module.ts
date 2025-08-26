import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EliminarTareaComponent } from './components/eliminarTareas/eliminar-tarea/eliminar-tarea.component';
import { InicioComponent } from './views/inicio/inicio.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { LoginComponent } from './views/login/login.component';
import { NewPasswordComponent } from './views/new-password/new-password.component';



const routes: Routes = [
  { path:'', redirectTo:'login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path:'inicio', component: InicioComponent },
  { path:'crear', component: CrearComponent },
  { path: 'editar/:id', component: EditarComponent },
  { path:'eliminar', component: EliminarTareaComponent},
  { path: 'newPasswordRequired', component: NewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
