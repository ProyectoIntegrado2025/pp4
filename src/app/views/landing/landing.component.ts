import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  menuAbierto = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  // Cerrar menú al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.menuAbierto) return;
    
    const target = event.target as HTMLElement;
    const nav = document.querySelector('app-landing nav');
    const menuToggle = document.querySelector('app-landing .menu-toggle');
    
    // Verificar si el click fue en el botón hamburguesa o dentro del nav
    const clickedOnToggle = menuToggle && (menuToggle.contains(target) || menuToggle === target);
    const clickedInsideNav = nav && nav.contains(target);
    
    // Cerrar solo si se hace clic fuera del navbar
    if (!clickedInsideNav || clickedOnToggle) {
      // Si se hizo clic en el toggle, no hacer nada (ya se maneja en toggleMenu)
      if (clickedOnToggle) {
        return;
      }
    }
    
    // Si se hizo clic fuera del nav, cerrar el menú
    if (!clickedInsideNav) {
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
}
