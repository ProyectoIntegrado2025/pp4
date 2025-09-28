import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Tarea } from 'src/app/models/tarea';
import { ApiTareasService } from 'src/app/services/api-tareas.service';
//import { AuthenticateService } from 'src/app/services/cognito.service';//
import { Router } from "@angular/router";
import { ApiGatewayService } from 'src/app/services/api.gateway.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService, AuthenticatedUser } from 'src/app/services/authServices/auth.service';


import html2canvas from 'html2canvas';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit, OnDestroy {
  tareas: Tarea[] = [];
  tareasTotal: Tarea[] = [];
  cargando: Boolean = true;
  error: Boolean = false;

  group: string = "TaskFlowTeamBack";
  @ViewChild('errorModal') errorModal?: ElementRef;

  private authSubscription!: Subscription; // Variable para la suscripción
  user: AuthenticatedUser | null = null;
  constructor(private apiTareasService: ApiTareasService, private datePipe: DatePipe, private authService: AuthService, private router: Router, private apiGatewayService: ApiGatewayService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authenticatedUser$.subscribe(authenticatedUser => {
      this.user = authenticatedUser;
      if (this.user) {
        console.log('¡Login exitoso! El usuario ha sido autenticado. Nombre de usuario:', this.user?.email);
        this.loadTasks(); 
      } else {
        console.log('Usuario no autenticado. Redirigiendo a /login.');

      }
    });
  }
  /*
   cargarTareas() {
     this.apiTareasService.getTareas().subscribe({
       next: res => {
         this.tareas = res;
         this.tareasTotal = res;
         this.cargando = false;
       },
       error: err => {
         console.log("Error al obtener tareas: " + err.message);
         this.error = true;
         this.cargando = false;
       }
     });
   }
 */

  obtenerTareasFinalizadas(): Tarea[] {
    return this.tareas.filter(tarea => tarea.estado === 'Finalizado');
  }

  obtenerTareasEnProceso(): Tarea[] {
    return this.tareas.filter(tarea => tarea.estado === 'En proceso');
  }

  obtenerTareasCanceladas(): Tarea[] {
    return this.tareas.filter(tarea => tarea.estado === 'Cancelado');
  }



  loadTasks() {
    console.log("Usuario autenticado. Cargando tareas para: ", this.user?.email);
    this.apiGatewayService.getTask(this.group).subscribe(
      data => {
        var dataJson = JSON.parse(data.body);
        const tasks = dataJson.Items;

        for (var task of tasks) {
          var tareaAux: Tarea = {
            _id: task.taskId,
            titulo: task.tittle,
            descripcion: task.description,
            asignado: task.assignedUserId,
            fecha_fin: new Date(task.endAt),
            estado: task.status
          }
          this.tareas.push(tareaAux);
        }
        this.cargando = false;
      },
      error => {
        console.log("Error al obtener tareas: " + error.message);
        this.error = true;
        this.cargando = false;
      }
    )
  }

  buscarTarea(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const buscarAsig = event.target.value.toLowerCase();
      if (buscarAsig) {
        this.tareas = this.tareas.filter(tarea => tarea.asignado.toLowerCase().includes(buscarAsig));
      } else {
        this.tareas = this.tareasTotal;
      }
    }
  }

  formatearFecha(fecha: Date): string {
    let fechaFormateada = this.datePipe.transform(fecha, "dd/MM/yy")
    if (!fechaFormateada) {
      fechaFormateada = "";
    }
    return fechaFormateada;
  }

  capturarYCompartir(tareaId: string): void {
    const tareaElement = document.getElementById(`tarea-${tareaId}`);
    if (tareaElement) {
      html2canvas(tareaElement).then(canvas => {
        // Convertir el canvas en imagen
        const imagenBase64 = canvas.toDataURL('image/png');

        // Crear un enlace temporal para descargar la imagen
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = imagenBase64;
        enlaceDescarga.download = `Tarea-${tareaId}.png`;
        enlaceDescarga.click();
      });
    }
  }

  cambiarColorEstado(estado: string) {
    switch (estado) {
      case 'Finalizado':
        return 'text-success';
      case 'En proceso':
        return 'text-warning';
      case 'Cancelado':
        return 'text-danger';
      default:
        return '';
    }
  }


  /* editarTarea() {
    this.ruta.navigate(['/editar', this.tareas._id]);
  } */
  editarTarea(tarea: Tarea) {
    console.log("Editar tarea:", tarea);
    this.router.navigate(['/editar', tarea._id]);
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogout(): void {
    const confirmacion = window.confirm('¿Estás seguro de que quieres cerrar tu sesión?');

    if (confirmacion) {
      this.authService.logout().then(() => {
        console.log('Cierre de sesión exitoso.');
      }).catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
    } else {
      console.log('Cierre de sesión cancelado.');
    }
  }


}
