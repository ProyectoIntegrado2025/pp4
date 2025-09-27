import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //agregado
import { NgClass } from '@angular/common';
import { Tarea } from '../../../models/tarea';
import { ApiTareasService } from '../../services/api-tareas.service';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/services/cognito.service';
import { v4 as uuidv4 } from 'uuid';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit{

formulario: FormGroup
alerta = false
group: string = "TaskFlowTeamBack";

usuarioActivo = {
  titulo: '',
  descripcion: '',
  asignado: '',
  fecha_fin: '',
  estado: 'En proceso'
}

constructor(private fb:FormBuilder, private apiTareasService: ApiTareasService, private authService: AuthenticateService, private router: Router, private apiGatewayService: ApiGatewayService){
  this.formulario = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    asignado: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    estado: [{ value: 'En proceso', disabled: true }, Validators.required]
  })
}

ngOnInit(): void {
  if(!this.authService.isAuthenticated()){
    this.router.navigate(["/login"]);
  }else{
    this.formulario.patchValue({    
      Estado: this.usuarioActivo.estado
    })
    this.formulario.get('estado')?.disable();
  }

}

enviar(){
  if (this.formulario.valid) {
    const nuevaTarea: any = {
      taskId: uuidv4(),
      tittle: this.formulario.value.titulo,
      description: this.formulario.value.descripcion,
      assignedUserId: this.formulario.value.asignado,
      endAt: new Date(this.formulario.value.fecha_fin),
      assignedGroupId: this.group,
      createdAt: new Date(),
      status: this.usuarioActivo.estado,

    };
    this.apiGatewayService.postTask(nuevaTarea).subscribe(
      (response)=>{
        console.log('Tarea creada:', response);
        this.alerta = true
        setTimeout(()=>{this.alerta = false},5000);
      },
      (error)=>{
        console.error('Error al crear la tarea:', error);
      }
    );
    console.log('Terminado');

    /*this.apiTareasService.createTarea(nuevaTarea).subscribe(response => {
      console.log('Tarea creada:', response);
      this.alerta = true
      setTimeout(()=>{this.alerta = false},5000);
    }, error => {
      console.error('Error al crear la tarea:', error);
    });*/
  }
}

tieneErrores(control: string, error:string){
  return this.formulario.get(control)?.hasError(error) && this.formulario.get(control)?.touched

}

}
