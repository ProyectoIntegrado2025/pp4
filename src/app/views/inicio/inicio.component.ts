import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { Tarea } from 'src/app/models/tarea';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';
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
  cargando = true;
  error = false;
  mensaje = '';

  @ViewChild('errorModal') errorModal?: ElementRef;
  mostrarModalConfirmacion = false;

  private authSubscription!: Subscription;
  user: AuthenticatedUser | null = null;

  constructor(
    private apiGatewayService: ApiGatewayService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authenticatedUser$.subscribe(authenticatedUser => {
      this.user = authenticatedUser;
      if (this.user) {
        console.log('✅ Usuario autenticado:', this.user.email);
        this.loadTasks();
      } else {
        console.log('⚠️ Usuario no autenticado, redirigiendo a login...');
        this.router.navigate(['/login']);
      }
    });
  }

  async loadTasks() {
    try {
      console.log('📡 Llamando a API Gateway...');
      const observable = await this.apiGatewayService.getTasks();
      observable.subscribe({
        next: (data) => {
          // Si viene como string JSON (por Lambda Proxy)
          const dataJson = typeof data.body === 'string' ? JSON.parse(data.body) : data;
          const tasks = dataJson.Items || dataJson; // DynamoDB puede devolver Items o directamente array

          this.tareas = tasks.map((task: any) => ({
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
          console.error("❌ Error al obtener tareas:", err);
          this.error = true;
          this.cargando = false;
        }
      });
    } catch (e) {
      console.error("❌ Error inesperado:", e);
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

  formatearFecha(fecha: string): string {
    return fecha || "";
  }

  capturarYCompartir(tareaId: string): void {
    const tareaElement = document.getElementById(`tarea-${tareaId}`);
    if (tareaElement) {
      html2canvas(tareaElement).then(canvas => {
        const enlace = document.createElement('a');
        enlace.href = canvas.toDataURL('image/png');
        enlace.download = `Tarea-${tareaId}.png`;
        enlace.click();
      });
    }
  }

  cambiarColorEstado(estado: string) {
    switch (estado) {
      case 'Finalizado': return 'text-success';
      case 'En Desarrollo': return 'text-warning';
      case 'Pendiente': return 'text-secondary';
      default: return '';
    }
  }

  editarTarea(tarea: Tarea) {
    console.log("✏️ Editar tarea:", tarea);
    this.router.navigate(['/editar', tarea.TareaId]);
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  onLogout(): void {
    this.mostrarModalConfirmacion = true;
  }

  cancelLogout(): void {
    this.mostrarModalConfirmacion = false;
  }

  async confirmLogout(): Promise<void> {
    this.mostrarModalConfirmacion = false;
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      console.log('👋 Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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
}
