import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';
import { Tarea } from 'src/app/models/tarea';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  formulario!: FormGroup;
  alerta = false;
  cargando = false;
  error = false;
  titulo = '';

  constructor(
    private fb: FormBuilder,
    private apiGatewayService: ApiGatewayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      Titulo: ['', Validators.required],
      Prioridad: ['Media', Validators.required],
      Estado: ['Pendiente', Validators.required],
      FechaInicio: ['', Validators.required],
      FechaFin: ['', Validators.required],
      Pasos: this.fb.array([this.fb.control('')])
    });
  }

  get pasos(): FormArray {
    return this.formulario.get('Pasos') as FormArray;
  }

  agregarPaso(): void {
    this.pasos.push(this.fb.control(''));
  }

  eliminarPaso(index: number): void {
    this.pasos.removeAt(index);
  }

  async enviar(): Promise<void> {
    if (this.formulario.invalid) return;

    const nuevaTarea: Tarea = {
      UsuarioId: 'test-user', // luego se reemplaza con Cognito
      TareaId: '',
      Titulo: this.formulario.value.Titulo,
      Estado: this.formulario.value.Estado,
      Prioridad: this.formulario.value.Prioridad,
      FechaInicio: this.formulario.value.FechaInicio,
      FechaFin: this.formulario.value.FechaFin,
      Pasos: this.formulario.value.Pasos.filter((p: string) => p.trim() !== ''),
      Favorito: this.formulario.value.Favorito
    };

    this.cargando = true;

    // 👉 guardar para mostrar en la alerta
    this.titulo = this.formulario.get('Titulo')?.value ?? '';

    try {
      const obs = await this.apiGatewayService.postTask(nuevaTarea);
      obs.subscribe({
        next: (res) => {
          console.log('✅ Tarea creada:', res);
          this.alerta = true;
          this.formulario.reset({
            Prioridad: 'Media',
            Estado: 'Pendiente',
            Pasos: ['']
          });
          this.cargando = false;

        // 👇 mensaje + redirección
        setTimeout(() => {
          this.alerta = false;
          this.router.navigate(['/inicio']);
        }, 3000);

        },
        error: (err) => {
          console.error('❌ Error al crear tarea:', err);
          this.error = true;
          this.cargando = false;
        }
      });
    } catch (e) {
      console.error('❌ Error inesperado:', e);
      this.cargando = false;
    }
  }

  tieneErrores(campo: string, tipoError: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.touched && control.hasError(tipoError));
  }
}
