import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cerrarNotificacion(notificationId: string): void {
    this.notificationService.eliminarNotificacion(notificationId);
  }

  obtenerIconoTexto(type: string): string {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  }

  obtenerClaseAlert(type: string): string {
    switch (type) {
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-danger';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  }
}

