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
  mostrarModalConfirmacion: boolean = false;
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


prioridad = 'Media'; // cambiá a 'Media' o 'Baja'
  

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


/* ESTA FUNCIÓN SOLO FUNCIONA CON APIGATEWAY DEL TIPO REST APPI */
  loadTasks() {
    console.log("Usuario autenticado. Cargando tareas para: ", this.user?.email);
    this.apiGatewayService.getTasks().subscribe(
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
    // Abre el modal en lugar de usar window.confirm()
    this.mostrarModalConfirmacion = true;
  }

  /**
   * Oculta el modal (si el usuario cancela el cierre de sesión).
   */
  cancelLogout(): void {
    this.mostrarModalConfirmacion = false;
    console.log('Cierre de sesión cancelado por el usuario.');
  }

  /**
   * Ejecuta la lógica de cierre de sesión si el usuario confirma en el modal.
   * Reemplaza la lógica de window.confirm()
   */
  async confirmLogout(): Promise<void> {
    this.mostrarModalConfirmacion = false; // Oculta el modal inmediatamente

    try {
      // 1. Llama a la función de logout del servicio de autenticación
      await this.authService.logout();

      // 2. Si es exitoso, redirige al login con un parámetro de éxito.
      this.router.navigate(['/login'], { queryParams: { logoutSuccess: true } });

      console.log('Cierre de sesión exitoso y redirección con notificación.');
    } catch (error) {
      console.error('Error al intentar cerrar sesión:', error);
      // Aquí podrías añadir lógica si el logout falla, aunque es raro.
    }
  }


}
