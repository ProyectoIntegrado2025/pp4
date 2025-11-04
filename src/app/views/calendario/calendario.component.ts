import { Component, OnInit } from '@angular/core';
import { ApiGatewayService } from '../../services/api.gateway.service';
import { Tarea } from '../../models/tarea';

interface CalendarDay {
  date: Date | null;
  titles: string[];
  showAll?: boolean;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  tareas: Tarea[] = [];
  loading = true;
  error = false;

  months = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  availableYears: number[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  grid: CalendarDay[] = [];

  constructor(private apiGatewayService: ApiGatewayService) {}

  ngOnInit(): void {
    // Rango de 3 años: año actual y los próximos dos
    const start = new Date().getFullYear();
    this.availableYears = [start, start + 1, start + 2];
    this.cargarTareas();
  }

  async cargarTareas(): Promise<void> {
    try {
      const obs = await this.apiGatewayService.getTasks();
      obs.subscribe({
        next: (data) => {
          const dataJson = typeof (data as any).body === 'string' ? JSON.parse((data as any).body) : data;
          const tasks = (dataJson as any).Items || dataJson;

          this.tareas = (tasks as any[]).map((task: any) => ({
            UsuarioId: task.UsuarioId,
            TareaId: task.TareaId,
            Titulo: task.Titulo,
            Estado: task.Estado,
            Prioridad: task.Prioridad,
            FechaInicio: task.FechaInicio,
            FechaFin: task.FechaFin,
            Pasos: task.Pasos || []
          }));

          this.loading = false;
          this.construirCalendario();
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    } catch {
      this.error = true;
      this.loading = false;
    }
  }

  onMonthChange(monthIndex: number): void {
    this.selectedMonth = Number(monthIndex);
    this.construirCalendario();
  }

  onYearChange(year: number): void {
    this.selectedYear = Number(year);
    this.construirCalendario();
  }

  prevMonth(): void {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear -= 1;
    } else {
      this.selectedMonth -= 1;
    }
    this.construirCalendario();
  }

  nextMonth(): void {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear += 1;
    } else {
      this.selectedMonth += 1;
    }
    this.construirCalendario();
  }

  private construirCalendario(): void {
    const firstOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
    const startWeekday = (firstOfMonth.getDay() + 6) % 7; // hacer lunes=0
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    const grid: CalendarDay[] = [];
    // Relleno anterior
    for (let i = 0; i < startWeekday; i++) {
      grid.push({ date: null, titles: [], showAll: false });
    }
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.selectedYear, this.selectedMonth, day);
      grid.push({ date, titles: [], showAll: false });
    }
    // Completar hasta múltiplo de 7
    while (grid.length % 7 !== 0) {
      grid.push({ date: null, titles: [], showAll: false });
    }

    // Mapear títulos por FechaFin (yyyy/mm/dd)
    const byKey = new Map<string, string[]>();
    for (const t of this.tareas) {
      if (!t.FechaFin) continue;
      const key = this.normalizeToYyyyMmDd(t.FechaFin);
      if (!key) continue;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key)!.push(t.Titulo);
    }

    for (const cell of grid) {
      if (!cell.date) continue;
      const d = this.toYyyyMmDd(cell.date);
      cell.titles = byKey.get(d) || [];
    }

    this.grid = grid;
  }

  toggleDropdown(index: number): void {
    const cell = this.grid[index];
    if (!cell || !cell.date) return;
    cell.showAll = !cell.showAll;
  }

  private toYyyyMmDd(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}/${mm}/${dd}`;
  }

  private normalizeToYyyyMmDd(value: string): string | null {
    if (!value) return null;
    const cleaned = value.trim().replace(/-/g, '/');
    const parts = cleaned.split('/');
    if (parts.length !== 3) return null;
    // Detectar si viene como yyyy/mm/dd o dd/mm/yyyy y normalizar
    // Heurística: si la primera parte tiene 4 dígitos => yyyy
    if (/^\d{4}$/.test(parts[0])) {
      const [y, m, d] = parts;
      const mm = String(Number(m)).padStart(2, '0');
      const dd = String(Number(d)).padStart(2, '0');
      return `${y}/${mm}/${dd}`;
    }
    // Si no, asumir dd/mm/yyyy y convertir
    const [d, m, y] = parts;
    if (!/^\d{4}$/.test(y)) return null;
    const mm = String(Number(m)).padStart(2, '0');
    const dd = String(Number(d)).padStart(2, '0');
    return `${y}/${mm}/${dd}`;
  }
}


