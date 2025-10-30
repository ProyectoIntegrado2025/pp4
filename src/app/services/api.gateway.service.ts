import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { fetchAuthSession } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService {

  private apiUrl = 'https://w5xifaljz4.execute-api.us-east-1.amazonaws.com/dev/tareas';

  constructor(private http: HttpClient) {}

  /**
   * 🔑 Construye los encabezados HTTP con el token Cognito (usa ID Token)
   */
  private async buildHeaders(): Promise<HttpHeaders> {
    try {
      const session = await fetchAuthSession();
      // 👇 Cambiamos accessToken → idToken
      const token = session?.tokens?.idToken?.toString();

      return new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      });
    } catch (error) {
      console.warn('⚠️ No se pudo obtener el token de sesión:', error);
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
  }

  // 🔹 Obtener todas las tareas
  async getTasks(): Promise<Observable<any>> {
    const headers = await this.buildHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

// Obtener una tarea por ID
async getTask(tareaId: string): Promise<Observable<any>> {
  const headers = await this.buildHeaders();
  const url = `${this.apiUrl}/${tareaId}`;
  return this.http.get(url, { headers });
}

// Crear una nueva tarea
async postTask(tarea: any): Promise<Observable<any>> {
  const headers = await this.buildHeaders();
  return this.http.post(this.apiUrl, JSON.stringify(tarea), { headers });
}

// Actualizar una tarea existente
async putTask(tareaId: string, tarea: any): Promise<Observable<any>> {
  const headers = await this.buildHeaders();
  const url = `${this.apiUrl}/${tareaId}`;
  return this.http.put(url, JSON.stringify(tarea), { headers });
}


  // 🔹 Eliminar una tarea
  async deleteTask(tareaId: string): Promise<Observable<any>> {
    const headers = await this.buildHeaders();
    const url = `${this.apiUrl}/${tareaId}`;
    return this.http.delete(url, { headers });
  }

async updateFavorito(tareaId: string, tarea: any, favorito:boolean): Promise<Observable<any>> {
  const headers = await this.buildHeaders();
  const url = `${this.apiUrl}/${tareaId}`;
  return this.http.put(url, JSON.stringify(tarea), { headers });
}
}