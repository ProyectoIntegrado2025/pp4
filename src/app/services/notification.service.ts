import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tarea } from '../models/tarea';

export interface Notification {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'error';
  tareas: Tarea[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Verifica si una fecha está a 1 día de vencer
   * @param fechaFin Fecha en formato dd/mm/yyyy o YYYY-MM-DD (ISO)
   * @returns true si la tarea vence mañana
   */
  private esFechaProximaAVencer(fechaFin: string): boolean {
    if (!fechaFin || fechaFin.trim() === '') {
      return false;
    }

    try {
      let fechaVencimiento: Date;
      
      // Detectar formato de fecha
      if (fechaFin.includes('/')) {
        // Formato dd/mm/yyyy
        const [dia, mes, anio] = fechaFin.split('/').map(Number);
        fechaVencimiento = new Date(anio, mes - 1, dia);
      } else if (fechaFin.includes('-')) {
        // Formato ISO YYYY-MM-DD (de input type="date")
        fechaVencimiento = new Date(fechaFin + 'T00:00:00');
      } else {
        // Intentar parseo directo
        fechaVencimiento = new Date(fechaFin);
      }
      
      // Validar que la fecha sea válida
      if (isNaN(fechaVencimiento.getTime())) {
        console.warn('Fecha inválida:', fechaFin);
        return false;
      }
      
      // Fecha de hoy a medianoche
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      // Fecha de mañana a medianoche
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);
      
      // Fecha de vencimiento a medianoche
      fechaVencimiento.setHours(0, 0, 0, 0);
      
      // Verificar si la fecha de vencimiento es mañana
      const esManana = fechaVencimiento.getTime() === manana.getTime();
      
      // Log para debugging
      if (esManana) {
        console.log('✅ Tarea encontrada que vence mañana:', fechaFin, '->', fechaVencimiento.toISOString());
      }
      
      return esManana;
    } catch (error) {
      console.error('Error al parsear fecha:', fechaFin, error);
      return false;
    }
  }

  /**
   * Verifica tareas que vencen en 1 día
   * @param tareas Lista de tareas a verificar
   * @returns Lista de tareas que vencen en 1 día
   */
  verificarTareasProximasAVencer(tareas: Tarea[]): Tarea[] {
    if (!tareas || tareas.length === 0) {
      return [];
    }

    // Filtrar tareas que:
    // 1. No estén finalizadas
    // 2. Vencen en 1 día
    const tareasProximas = tareas.filter(tarea => {
      const estado = (tarea.Estado || '').toLowerCase();
      const noFinalizada = !estado.includes('finalizado') && !estado.includes('completado');
      const vencePronto = this.esFechaProximaAVencer(tarea.FechaFin);
      
      return noFinalizada && vencePronto;
    });

    return tareasProximas;
  }

  /**
   * Genera notificaciones para las tareas que vencen pronto
   * @param tareas Lista de tareas a verificar
   */
  generarNotificacionesTareas(tareas: Tarea[]): void {
    console.log('🔔 Verificando notificaciones para', tareas.length, 'tareas');
    
    const tareasProximas = this.verificarTareasProximasAVencer(tareas);
    
    console.log('📋 Tareas que vencen mañana:', tareasProximas.length, tareasProximas);
    
    if (tareasProximas.length === 0) {
      this.notificationsSubject.next([]);
      return;
    }

    const mensaje = tareasProximas.length === 1
      ? `Tienes 1 tarea que vence mañana: "${tareasProximas[0].Titulo}"`
      : `Tienes ${tareasProximas.length} tareas que vencen mañana`;

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      message: mensaje,
      type: 'warning',
      tareas: tareasProximas
    };

    console.log('✅ Notificación generada:', notification);
    this.notificationsSubject.next([notification]);
  }

  /**
   * Elimina una notificación específica
   * @param notificationId ID de la notificación a eliminar
   */
  eliminarNotificacion(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Limpia todas las notificaciones
   */
  limpiarNotificaciones(): void {
    this.notificationsSubject.next([]);
  }
}

