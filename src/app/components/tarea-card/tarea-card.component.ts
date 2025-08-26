import { Component, Input, OnInit } from '@angular/core';
import { Tarea } from '../../models/tarea';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
//Conexion a la api local declarada en api-tareas.service.ts
import { ApiTareasService } from 'src/app/services/api-tareas.service';



@Component({
  selector: 'app-tarea-card',
  templateUrl: './tarea-card.component.html',
  styleUrls: ['./tarea-card.component.css']
})
export class TareaCardComponent {
  tareas: Tarea[] = []; // Variable para almacenar las tareas
  /* @Input() tareas: Tarea = new Tarea();
  @Input() _id?: string; // ID opcional
  @Input() titulo?: string; // Título opcional
  @Input() descripcion?: string; // Descripción opcional
  @Input() asignado?: string; // Asignado opcional
  @Input() fecha_fin?: Date; // Fecha de finalización opcional
  @Input() estado?: string; // Estado opcional
  /* @Input() mostrarEditarBoton: boolean = false;  */// Controla si el botón es visible */

  /* fechaFin: string = ""; */

  constructor(private datePipe: DatePipe, private ruta: Router, private apiServiceTareas: ApiTareasService){}

  ngOnInit(){
    /* this.fechaFin = this.formatearFecha(this.tareas.fecha_fin); */
    this.cargarTareas();
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

  formatearFecha(fecha: Date):string{   
    let fechaFormateada = this.datePipe.transform(fecha, "dd/MM/yy")
    if(!fechaFormateada){
      fechaFormateada = "";
    }
    return fechaFormateada;
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

  /* editarTarea() {
    this.ruta.navigate(['/editar', this.tareas._id]);
  } */
}
