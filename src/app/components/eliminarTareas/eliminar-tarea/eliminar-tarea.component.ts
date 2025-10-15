import { Component, OnInit } from '@angular/core';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';
import { Tarea } from 'src/app/models/tarea';

@Component({
  selector: 'app-eliminar-tarea',
  templateUrl: './eliminar-tarea.component.html',
  styleUrls: ['./eliminar-tarea.component.css']
})
export class EliminarTareaComponent implements OnInit {
  tareas: Tarea[] = [];
  tareasTotal: Tarea[] = [];
  cargando = true;
  error = false;
  mensaje = '';

  constructor(private apiGatewayService: ApiGatewayService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.cargando = true;
    this.error = false;
    try {
      const obs = await this.apiGatewayService.getTasks();
      obs.subscribe({
        next: (res) => {
          const dataJson = typeof res.body === 'string' ? JSON.parse(res.body) : res;
          const items = dataJson.Items || dataJson;

          this.tareas = items.map((task: any) => ({
            UsuarioId: task.UsuarioId,
            TareaId: task.TareaId,
            Titulo: task.Titulo,
            Estado: task.Estado,
            Prioridad: task.Prioridad,
            FechaInicio: task.FechaInicio,
            FechaFin: task.FechaFin,
            Pasos: task.Pasos || []
          }));

          this.tareasTotal = [...this.tareas];
          this.cargando = false;
        },
        error: (err) => {
          console.error('❌ Error al obtener tareas:', err);
          this.error = true;
          this.cargando = false;
        }
      });
    } catch (e) {
      console.error('❌ Error inesperado:', e);
      this.error = true;
      this.cargando = false;
    }
  }

  buscarTarea(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const buscar = event.target.value.toLowerCase();
      this.tareas = buscar
        ? this.tareasTotal.filter(t => t.Titulo.toLowerCase().includes(buscar))
        : [...this.tareasTotal];
    }
  }

  async deleteTask(tareaId: string): Promise<void> {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;

    this.cargando = true;
    try {
      const obs = await this.apiGatewayService.deleteTask(tareaId);
      obs.subscribe({
        next: (res) => {
          console.log('✅ Tarea eliminada:', res);
          this.tareas = this.tareas.filter(t => t.TareaId !== tareaId);
          this.tareasTotal = [...this.tareas];
          this.mensaje = 'Tarea eliminada correctamente.';
          this.cargando = false;
        },
        error: (err) => {
          console.error('❌ Error al eliminar tarea:', err);
          this.error = true;
          this.cargando = false;
        }
      });
    } catch (e) {
      console.error('❌ Error inesperado:', e);
      this.error = true;
      this.cargando = false;
    }
  }

  cambiarColorEstado(estado: string): string {
    switch (estado) {
      case 'Finalizado': return 'text-success';
      case 'En Desarrollo': return 'text-warning';
      case 'Pendiente': return 'text-secondary';
      default: return '';
    }
  }
}
