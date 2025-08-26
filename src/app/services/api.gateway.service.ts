import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService {

  constructor(private http: HttpClient) {}

  private apiUrl = "https://8uv9ny98ub.execute-api.us-east-1.amazonaws.com/V1";
  private usersUrl = "/users"
  private groupsUrl = "/groups"
  private tasksUrl = "/tasks"

  // Obtiene todos los usuarios
  getUsers():Observable<any> {
    return this.http.get<any>(this.apiUrl+this.usersUrl);
  }

  // Obtiene un usuario por ID
  getUser(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.apiUrl+this.usersUrl, { params });
  }

  // Obtiene todos los grupos
  getGroups():Observable<any> {
    return this.http.get<any>(this.apiUrl+this.groupsUrl);
  }

  // Obtiene un grupo por ID
  getGroup(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.apiUrl+this.groupsUrl, { params });
  }

  // Obtiene todas las tareas
  getTasks():Observable<any> {
    return this.http.get<any>(this.apiUrl+this.tasksUrl);
  }

  // Obtiene una tarea por ID
  getTask(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.apiUrl+this.tasksUrl, { params });
  }

  // Crear tarea
  postTask(task: any): Observable<any>{
    const url = `${this.apiUrl}${this.tasksUrl}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, JSON.stringify(task), { headers });
  }

  // Elimnar tarea
  deleteTask(taskId: any): Observable<any>{
    const params = new HttpParams().set('id', taskId);
    return this.http.delete(`${this.apiUrl}${this.tasksUrl}`, { params });
  }
}
