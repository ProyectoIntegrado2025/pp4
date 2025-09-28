import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './componentes/calendar/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'Eventra';
}

