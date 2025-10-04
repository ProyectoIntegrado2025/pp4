import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Tema = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'tema_seleccionado';
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null); // null null recomendado cuando no estamos en el contexto de un componente.
    const saved = localStorage.getItem(this.STORAGE_KEY) as Tema | null;
    this.applyTheme(saved === 'dark' ? 'dark' : 'light', false);
  }

  getCurrent(): Tema {
    const main = this.document.querySelector('main');
    if (main && main.classList.contains('theme-dark')) return 'dark';
    if (this.document.documentElement.classList.contains('theme-dark')) return 'dark'; //Esto es un fallback porque algunas reglas pueden aplicar sobre html
    return 'light';
  }

  toggle(): Tema { 
    const next: Tema = this.getCurrent() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next, true); //se activa la persistencia solo cuando usamos el toggle
    return next;//devuelve el nuevo tema para que quien llamó tenga referencia del nuevo estado
  }

  setTheme(theme: Tema) {
    this.applyTheme(theme, true);
  }

  private applyTheme(theme: Tema, persist = true) {
    const main = this.document.querySelector('main') as HTMLElement | null;

    const removeCls = (el: HTMLElement | null, cls: string) => { //toma un elemento o null, y un nombre de clase
      if (!el) return; //si existe
      this.renderer.removeClass(el, cls);//i el elemento existe llama this.renderer.removeClass(el, cls)
    };

    removeCls(main, 'theme-light');//limpia de main las clases de tema anteriores para evitar acumulación
    removeCls(main, 'theme-dark');//limpia de main las clases de tema anteriores para evitar acumulación
    removeCls(this.document.documentElement as unknown as HTMLElement, 'theme-light');//lo mismo sobre documentElement (html)
    removeCls(this.document.documentElement as unknown as HTMLElement, 'theme-dark');//lo mismo sobre documentElement (html)

    if (main) this.renderer.addClass(main, `theme-${theme}`);//si main existe, añade theme-light o theme-dark a main
    this.renderer.addClass(this.document.documentElement as unknown as HTMLElement, `theme-${theme}`);//añade la clase al <html> también. Esto es útil como fallback o para reglas globales. Se añade incluso si main no existe.

    if (persist) localStorage.setItem(this.STORAGE_KEY, theme); //si persist es true, escribe en localStorage el string 'light' o 'dark'. Esto hace que la elección sobreviva a recargas
  }
}
