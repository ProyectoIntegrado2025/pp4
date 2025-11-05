import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';
import { Tarea } from 'src/app/models/tarea';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  tarea: Tarea = new Tarea();
  cargando = false;
  error = false;
  exito = false;

  estados = ['Pendiente', 'En Desarrollo', 'Finalizado'];
  prioridades = ['Baja', 'Media', 'Alta'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiGatewayService: ApiGatewayService
  ) {}

  async ngOnInit() {
    const tareaId = this.route.snapshot.paramMap.get('id');
    if (tareaId) {
      await this.obtenerTarea(tareaId);
    }
  }

  async obtenerTarea(id: string) {
    this.cargando = true;
    try {
      const obs = await this.apiGatewayService.getTask(id); // ✅ nombre original respetado
      obs.subscribe({
        next: (res) => {
          // DynamoDB puede devolver { Item: {...} } o el objeto plano
          const dataJson = typeof res.body === 'string' ? JSON.parse(res.body) : res;
          const tarea = dataJson.Item || dataJson;

          // 🔹 Mapeo asegurando compatibilidad con tu modelo
          this.tarea = {
            UsuarioId: tarea.UsuarioId ?? '',
            TareaId: tarea.TareaId ?? id,
            Titulo: tarea.Titulo ?? '',
            Estado: tarea.Estado ?? 'Pendiente',
            Prioridad: tarea.Prioridad ?? 'Media',
            FechaInicio: tarea.FechaInicio ?? '',
            FechaFin: tarea.FechaFin ?? '',
            Pasos: tarea.Pasos ?? []
          };

          this.cargando = false;
        },
        error: (err) => {
          console.error('❌ Error al obtener tarea:', err);
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

  async editarTarea() {
    this.cargando = true;
    this.error = false;
    try {
      // 🔹 usar PUT en lugar de POST
      const obs = await this.apiGatewayService.putTask(this.tarea.TareaId, this.tarea);
      obs.subscribe({
        next: (res) => {
          console.log('✅ Tarea actualizada:', res);
          this.exito = true;
          this.cargando = false;
          setTimeout(() => this.router.navigate(['/inicio']), 1500);
        },
        error: (err) => {
          console.error('❌ Error al actualizar tarea:', err);
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

  // Función trackBy para evitar que Angular recree los elementos del DOM
  trackByIndex(index: number, item: any): number {
    return index;
  }
}
