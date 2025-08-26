import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tarea } from '../models/tarea';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiTareasService {

  private apiUrl = "http://taskflow-env.eba-wmmxe8zz.us-east-1.elasticbeanstalk.com";

  constructor(private http: HttpClient) { }

  getTareas(){
    return this.http.get<Tarea[]>(`${this.apiUrl}/api/tareas`);
  }

  getTareaById(id: string){
    return this.http.get<Tarea>(`${this.apiUrl}/api/tareas/${id}`);
  }

/**
 * @method deleteTareaById
 * @param id 
 * @returns La eliminación de un elemento con un _id particular en cada elemento
 */
  deleteTareaById(id: string | number){
    return this.http.delete<Tarea>(`${this.apiUrl}/api/tareas/${id}`);
  }

  createTarea(tarea: Tarea){
    return this.http.post<Tarea>(`${this.apiUrl}/api/tareas`, tarea);
  }
  
  editarTarea(id: number | string, tarea: Tarea) {
    return this.http.put<Tarea>(`${this.apiUrl}/api/tareas/${id}`, tarea);
  }
}