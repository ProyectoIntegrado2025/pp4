import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tarea } from '../../../models/tarea';
import { CommonModule } from '@angular/common';
import { ApiTareasService } from '../../services/api-tareas.service';
import { FormsModule } from '@angular/forms';
import { AuthenticateService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent {

  tarea: Tarea = {
    _id: '',
    titulo: '',
    descripcion: '',
    asignado: '',
    fecha_fin: new Date(),
    estado: ''
  };

  estados: string[] = ['En proceso', 'Finalizado', 'Cancelado'];

  apiServicio = inject(ApiTareasService);
  ruta: ActivatedRoute = inject(ActivatedRoute)

  constructor(private enrutador: Router, private authService: AuthenticateService) { }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()){
      this.enrutador.navigate(["/login"]);
    }else{
      this.ruta.params.subscribe({
        next: params => {
          const tareaID = params['id'];
          if (tareaID) {
            this.apiServicio.getTareaById(params['id']).subscribe({
              next: (data: Tarea) => {
                this.tarea = data;
                console.log(this.tarea)
              },
              error: error => {
                console.log(error)
              }
            });
          }
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }


  obtenerTareaPorId(id: string) {
    this.apiServicio.getTareaById(id).subscribe({
      next: data => {
        this.tarea = data;
      }
    })
  }


  editarTarea() {
    if (!this.tarea._id) {
      console.log('Es necesario el ID de la tarea')
    }
    this.apiServicio.editarTarea(this.tarea._id, this.tarea).subscribe({
      next: (data: Tarea) => {
        console.log('Tarea editada', data)
        this.enrutador.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Error al editar la tarea:', error);
      }
    });
  }

}
