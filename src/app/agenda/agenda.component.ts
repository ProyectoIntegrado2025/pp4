import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Evento {
  actividad: string;
  horario: string;
  dia: number;
  mes: number;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  currentDate = new Date();
  selectedDate: Date | null = null;

  events: { [key: string]: Evento } = {};

  editTitle = '';
  editTime = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  // 👉 Getter para usar "days" en el HTML
  get days(): Date[] {
    return this.daysInMonth();
  }

  loadEvents(): void {
    const mes = this.currentDate.getMonth() + 1; // 1 a 12
    this.http.get<Evento[]>(`http://localhost:3000/api/calendario/${mes}`)
      .subscribe(data => {
        this.events = {};
        data.forEach(evt => {
          const fecha = new Date(this.year, evt.mes - 1, evt.dia);
          const key = fecha.toDateString();
          this.events[key] = evt;
        });
      });
  }

  get month(): number {
    return this.currentDate.getMonth();
  }

  get year(): number {
    return this.currentDate.getFullYear();
  }

  daysInMonth(): Date[] {
    const date = new Date(this.year, this.month, 1);
    const days: Date[] = [];
    while (date.getMonth() === this.month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.year, this.month - 1, 1);
    this.selectedDate = null;
    this.loadEvents();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.year, this.month + 1, 1);
    this.selectedDate = null;
    this.loadEvents();
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
    const key = date.toDateString();
    const event = this.events[key];
    if (event) {
      this.editTitle = event.actividad;
      this.editTime = event.horario;
    } else {
      this.editTitle = '';
      this.editTime = '';
    }
  }

  addOrUpdateEvent(): void {
    if (!this.selectedDate) return;
    if (this.editTitle.trim() === '') {
      alert('La actividad no puede estar vacía');
      return;
    }

    const key = this.selectedDate.toDateString();
    const dia = this.selectedDate.getDate();
    const mes = this.month + 1;

    const evento: Evento = {
      actividad: this.editTitle,
      horario: this.editTime,
      dia,
      mes
    };

    if (this.eventExists()) {
      this.http.patch(`http://localhost:3000/api/calendario/${mes}/${dia}`, evento)
        .subscribe(() => this.loadEvents());
    } else {
      this.http.post(`http://localhost:3000/api/calendario/${mes}`, evento)
        .subscribe(() => this.loadEvents());
    }

    this.events[key] = evento;
  }

  deleteEvent(): void {
    if (!this.selectedDate) return;
    const dia = this.selectedDate.getDate();
    const mes = this.month + 1;

    this.http.delete(`http://localhost:3000/api/calendario/${mes}/${dia}`)
      .subscribe(() => this.loadEvents());

    const key = this.selectedDate.toDateString();
    delete this.events[key];
    this.editTitle = '';
    this.editTime = '';
  }

  eventExists(): boolean {
    if (!this.selectedDate) return false;
    return !!this.events[this.selectedDate.toDateString()];
  }

  getEvent(date: Date): Evento | null {
    return this.events[date.toDateString()] || null;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}



