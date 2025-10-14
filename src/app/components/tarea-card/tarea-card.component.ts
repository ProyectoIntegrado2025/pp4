import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiGatewayService } from 'src/app/services/api.gateway.service'; // ✅ nuevo servicio
import { Tarea } from '../../models/tarea'; // modelo local (actualizá si cambió ruta o estructura)

@Component({
  selector: 'app-tarea-card',
  templateUrl: './tarea-card.component.html',
  styleUrls: ['./tarea-card.component.css']
})
export class TareaCardComponent implements OnInit {

  tareas: Tarea[] = [];

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private apiGatewayService: ApiGatewayService
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  /**
   * 🔹 Obtiene las tareas desde el backend (API Gateway)
   */
  cargarTareas(): void {
    console.log('📡 Cargando tareas desde API Gateway...');
    // recordá que getTasks() devuelve Promise<Observable<any>>
    this.apiGatewayService.getTasks().then(obs => {
      obs.subscribe({
        next: (data: any[]) => {
          console.log('✅ Tareas cargadas:', data);
          this.tareas = data.map(t => ({
            TareaId: t.TareaId,
            Titulo: t.Titulo,
            Estado: t.Estado,
            Prioridad: t.Prioridad,
            FechaInicio: t.FechaInicio,
            FechaFin: t.FechaFin,
            Pasos: t.Pasos || [],
            UsuarioId: t.UsuarioId
          }));
        },
        error: (error) => {
          console.error('❌ Error al obtener tareas:', error);
        }
      });
    }).catch(err => {
      console.error('❌ Error al construir la request:', err);
    });
  }

  /**
   * 🧩 Formatea fechas al estilo dd/MM/yy
   */
  formatearFecha(fecha: string | Date): string {
    if (!fecha) return '';
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const fechaFormateada = this.datePipe.transform(date, 'dd/MM/yy');
    return fechaFormateada || '';
  }

  /**
   * 🎨 Cambia color de texto según el estado
   */
  cambiarColorEstado(estado: string): string {
    switch (estado) {
      case 'Finalizado':
        return 'text-success';
      case 'En Progreso':
        return 'text-warning';
      case 'Pendiente':
        return 'text-secondary';
      case 'Cancelado':
        return 'text-danger';
      default:
        return '';
    }
  }

  /**
   * 🔄 Navegar a edición (si implementás esa pantalla)
   */
  editarTarea(tareaId: string): void {
    this.router.navigate(['/editar', tareaId]);
  }
}
