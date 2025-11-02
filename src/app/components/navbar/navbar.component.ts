import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuAbierto = false;

  @Output() logoutRequested = new EventEmitter<void>();

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  // Cerrar menú al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const nav = document.querySelector('.zenki-navbar');
    if (nav && !nav.contains(target) && this.menuAbierto) {
      this.cerrarMenu();
    }
  }

  // Cerrar menú al presionar ESC
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.menuAbierto) {
      this.cerrarMenu();
    }
  }

  onLogout(): void {
    this.logoutRequested.emit();
  }
}
