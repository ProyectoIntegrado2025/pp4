import { Component, OnInit } from '@angular/core'; //se suma OnInit
import { Router } from '@angular/router';

//clase Tarea de tarea.ts dentro de models
import { Tarea } from 'src/app/models/tarea';

//Conexion a la api local declarada en api-tareas.service.ts
import { ApiTareasService } from 'src/app/services/api-tareas.service';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';
import { AuthenticateService } from 'src/app/services/cognito.service';


@Component({
  selector: 'app-eliminar-tarea',
  templateUrl: './eliminar-tarea.component.html',
  styleUrls: ['./eliminar-tarea.component.css']
})
export class EliminarTareaComponent implements OnInit {
  tareas: Tarea[] = []; // Variable para almacenar las tareas
  user: any;
  group: string = "TaskFlowTeamBack";
  
  constructor(private apiServiceTareas: ApiTareasService, private authService: AuthenticateService, private router: Router, private apiGatewayService: ApiGatewayService){}

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(["/login"]);
    }else{
      //this.cargarTareas();
      this.user = localStorage.getItem("user");
      this.loadTasks();
    }
  }

  /**
   * @method cargarTareas
   * Trae un array del tipo Tarea definido en models tarea.ts
   */
  cargarTareas(){
    console.log(`Cargando tareas...`) 
    this.apiServiceTareas.getTareas().subscribe({
      next: data =>{
        console.log(data)
        this.tareas = data;
        console.log(`Tareas cargadas`) 
      }, error: error => {
        console.log(error)
      }
    })
  }

  cambiarColorEstado(estado: string){
    switch(estado) {
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


 /**
  * @method eliminarTarea
  * @param id 
  * Recibe un parámetro _id del tipo string o number necesario para deleteTareaById (funcion de mongoose)
  */
  eliminarTarea(id: string | number): void {

    this.apiServiceTareas.deleteTareaById(id).subscribe({
      
      next: () => {
        console.log('Tarea eliminada exitosamente');
        this.cargarTareas();
      },
      error: error => {
        console.error('Error al eliminar tarea:', error);
      }
    });
  }

  deleteTask(taskId: string) {
    this.apiGatewayService.deleteTask(taskId).subscribe(
      response => {
        console.log('Tarea eliminada:', response);
        // Actualiza la lista de tareas si es necesario
        this.loadTasks(); // Supongamos que esta función recarga las tareas
      },
      error => {
        console.error('Error al eliminar tarea:', error);
      }
    );
  }
 /**
  * @method buscarTarea
  * @param event 
  * Recibe un parámetro evento
  * Si éste es una instancia de HTMLInputElement, ejecuta
  */
  buscarTarea(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const buscarAsig = event.target.value.toLowerCase();
      if (buscarAsig) {
        this.tareas = this.tareas.filter(tarea => tarea.asignado.toLowerCase().includes(buscarAsig));
      } else {
        this.cargarTareas(); 
      }
    }
  }

  loadTasks(){
    this.apiGatewayService.getTask(this.group).subscribe(
      data => {
        var dataJson = JSON.parse(data.body);
        const tasks = dataJson.Items;
        this.tareas = [];
        for(var task of tasks){
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
      },
      error => {
        console.log("Error al obtener tareas: " + error.message);
      }
    )
  }

}
