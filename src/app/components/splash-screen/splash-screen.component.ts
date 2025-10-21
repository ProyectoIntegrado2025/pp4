import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})
export class SplashScreenComponent implements OnInit {

  progress = 0;
  interval: any;

  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 2;
      } else {
        clearInterval(this.interval);
        this.playFadeOut();
      }
    }, 80);
  }

  /** 🔹 Aplica la clase de salida y luego navega al Home */
  playFadeOut() {
    const container = this.el.nativeElement.querySelector('.splash-container');
    this.renderer.addClass(container, 'fade-out');

    // Esperamos que termine la animación antes de navegar
    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 900); // duración del fade-out
  }
}
