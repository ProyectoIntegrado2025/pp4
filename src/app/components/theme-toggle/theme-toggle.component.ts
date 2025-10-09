import { Component } from '@angular/core';
import { ThemeService, Tema } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  current: Tema = 'light';
  iconLight = 'assets/temas/light.png';
  iconDark  = 'assets/temas/dark.png';
  iconSrc = this.iconLight;
  iconAlt = 'Activar modo oscuro';

  constructor(private theme: ThemeService) {}

  ngOnInit(): void {
    this.current = this.theme.getCurrent();
    this.updateIcon();
  }

  onToggle(): void {
    const next = this.theme.toggle(); // aplica y persiste
    this.current = next;
    this.updateIcon();
  }

  private updateIcon(): void {
    if (this.current === 'dark') {
      this.iconSrc = this.iconDark;
      this.iconAlt = 'Modo claro';
    } else {
      this.iconSrc = this.iconLight;
      this.iconAlt = 'Modo oscuro';
    }
  }
}
