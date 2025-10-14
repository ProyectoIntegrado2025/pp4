import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService {

  constructor(private http: HttpClient) {}

  private apiUrl = "https://9tjqkigts8.execute-api.us-east-1.amazonaws.com/pp4apiG_RestApi";
  private usersUrl = "/users"
  private groupsUrl = "/groups"
  private tasksUrl = "/tasks"

  // Obtiene todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.usersUrl}`);
  }  
 /*  getUsers():Observable<any> {
    return this.http.get<any>(this.apiUrl+this.usersUrl);
  } */


  // Obtiene un usuario por ID
  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.usersUrl}/${id}`);
  }  
/*   getUser(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.apiUrl+this.usersUrl, { params });
  } */


  // Obtiene todos los grupos
  getGroups(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.groupsUrl}`);
  }
/*   getGroups():Observable<any> {
    return this.http.get<any>(this.apiUrl+this.groupsUrl);
  } */


  // Obtiene un grupo por ID
    getGroup(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.groupsUrl}/${id}`);
  }
  /* getGroup(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.apiUrl+this.groupsUrl, { params });
  } */


  // Obtiene todas las tareas
  getTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.tasksUrl}`);
  }
  /* getTasks():Observable<any> {
    return this.http.get<any>(this.apiUrl+this.tasksUrl);
  } */


  // Obtiene una tarea por ID
  getTask(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.tasksUrl}/${id}`);
  }
  /* getTask(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(this.apiUrl+this.tasksUrl, { params });
  } */


  // Crear tarea
  postTask(task: any): Observable<any> {
    const url = `${this.apiUrl}${this.tasksUrl}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, JSON.stringify(task), { headers });
  }
  /* postTask(task: any): Observable<any>{
    const url = `${this.apiUrl}${this.tasksUrl}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, JSON.stringify(task), { headers });
  } */


  // Elimnar tarea
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.tasksUrl}/${taskId}`);
  }
/*   deleteTask(taskId: any): Observable<any>{
    const params = new HttpParams().set('id', taskId);
    return this.http.delete(`${this.apiUrl}${this.tasksUrl}`, { params });
  } */

getAssistantReply(message: string, userId: string): Observable<any> {
  const url = `${this.apiUrl}/assistant`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { message, userId };
  return this.http.post(url, body, { headers });
}

}


