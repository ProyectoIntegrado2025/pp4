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

// ====== NUEVAS PROPIEDADES ======
showStats = false;
totalTareas = 0;
ultimaActualizacion: Date | null = null;

estadoStats: Array<{ label: string; count: number; percent: number; color: string }> = [];
prioridadStats: Array<{ label: string; count: number; percent: number; color: string }> = [];

// Para la dona (Estados)
donutEstados: Array<{ arc: number; offset: number; color: string }> = [];

// ====== NUEVOS MÉTODOS ======
openStats(): void {
  this.computeStatsSafe();
  this.ultimaActualizacion = new Date();
  this.showStats = true;
}

closeStats(): void {
  this.showStats = false;
}

/**
 * Obtiene la fuente de datos sin romper tu código:
 * intenta this.tareas, luego this.tareasFiltradas, luego this.listaTareas.
 */
private getListaTareas(): any[] {
  const self: any = this as any;
  return (self.tareas && Array.isArray(self.tareas) && self.tareas.length >= 0) ? self.tareas :
         (self.tareasFiltradas && Array.isArray(self.tareasFiltradas) && self.tareasFiltradas.length >= 0) ? self.tareasFiltradas :
         (self.listaTareas && Array.isArray(self.listaTareas) && self.listaTareas.length >= 0) ? self.listaTareas :
         [];
}

/**
 * Normaliza propiedades esperadas: Estado / Prioridad (con fallback por si vienen en minúsculas o distinto nombre)
 */
private pickField(obj: any, keys: string[], fallback: string = 'Desconocido'): string {
  for (const k of keys) {
    if (obj && typeof obj[k] === 'string' && obj[k].trim() !== '') return obj[k].trim();
  }
  return fallback;
}

/**
 * Colores amigables con tu paleta. Usa variables CSS si existen; si no, aplica defaults.
 */
private colorForEstado(label: string): string {
  const l = (label || '').toLowerCase();
  const css = getComputedStyle(document.documentElement);

  // Intentamos primero variables CSS específicas, si existen
  const fromVar = (v: string, def: string) => css.getPropertyValue(v).trim() || def;

  if (l.includes('pend'))   return fromVar('--estado-pendiente', '#FFC857');  // Amarillo
  if (l.includes('desa') || l.includes('prog') || l.includes('en pro')) return fromVar('--estado-desarrollo', '#1E7266'); // Verde azulado
  if (l.includes('fin') || l.includes('comp') || l.includes('real')) return fromVar('--estado-finalizado', '#3FAE49'); // Verde brillante
  if (l.includes('canc'))   return fromVar('--estado-cancelada', '#2D2D2D');  // Gris oscuro
  return fromVar('--primario', '#1E7266');
}

private colorForPrioridad(label: string): string {
  const l = (label || '').toLowerCase();
  if (l.includes('alta')) return getComputedStyle(document.documentElement).getPropertyValue('--prio-alta') || '#E53935';
  if (l.includes('med'))  return getComputedStyle(document.documentElement).getPropertyValue('--prio-media') || '#FB8C00';
  if (l.includes('baja')) return getComputedStyle(document.documentElement).getPropertyValue('--prio-baja') || '#43A047';
  // fallback a acento
  return getComputedStyle(document.documentElement).getPropertyValue('--acento') || '#FFC857';
}

/**
 * Calcula los conteos y arma datos para ambos gráficos.
 * No modifica tu estado actual; solo lee.
 */
private computeStatsSafe(): void {
  const lista = this.getListaTareas();

  // Conteos
  const byEstado = new Map<string, number>();
  const byPrio   = new Map<string, number>();

  for (const t of lista) {
    const estado = this.pickField(t, ['Estado', 'estado']);
    const prio   = this.pickField(t, ['Prioridad', 'prioridad']);

    byEstado.set(estado, (byEstado.get(estado) || 0) + 1);
    byPrio.set(prio, (byPrio.get(prio) || 0) + 1);
  }

  this.totalTareas = lista.length || 0;

  // Estados (para dona)
  const estadosArr = Array.from(byEstado.entries()).map(([label, count]) => {
    const percent = this.totalTareas > 0 ? Math.round((count * 100) / this.totalTareas) : 0;
    return { label, count, percent, color: this.colorForEstado(label) };
  });
  // Orden opcional: completadas al final para contraste (puedes quitar si no lo querés)
  this.estadoStats = estadosArr;

  // Prioridades (barras)
  const prioArr = Array.from(byPrio.entries()).map(([label, count]) => {
    const percent = this.totalTareas > 0 ? Math.round((count * 100) / this.totalTareas) : 0;
    return { label, count, percent, color: this.colorForPrioridad(label) };
  });
  // Si querés un orden específico (Alta/Media/Baja), lo aplicamos:
  const order = ['alta', 'media', 'baja'];
  this.prioridadStats = prioArr.sort((a, b) => {
    const ia = order.findIndex(o => a.label.toLowerCase().includes(o));
    const ib = order.findIndex(o => b.label.toLowerCase().includes(o));
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  // Armar segmentos de la dona
  this.donutEstados = this.buildDonut(this.estadoStats);
}

/**
 * Crea segmentos para una dona SVG:
 * - Cada segmento usa stroke-dasharray con su % y desplazamiento acumulado.
 */
private buildDonut(items: Array<{ percent: number; color: string }>) {
  let acc = 25; // offset inicial para que la dona arranque arriba (top)
  const segs: Array<{ arc: number; offset: number; color: string }> = [];
  for (const it of items) {
    const arc = Math.max(0, Math.min(100, it.percent));
    segs.push({ arc, offset: acc, color: it.color });
    acc -= arc; // movemos el offset para el siguiente (sentido antihorario)
  }
  return segs;
}

}
