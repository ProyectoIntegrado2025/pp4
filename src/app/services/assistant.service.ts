// src/app/services/assistant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

type AskPayload =
  | { message: string; userId: string }  // MVP sin auth
  | { message: string };                 // con Authorizer (JWT en header)

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private url = environment.apiAssistantUrl;

  constructor(private http: HttpClient) {}

  // --- MVP (sin authorizer) ---
  askNoAuth(message: string, userId: string) {
    return this.http.post<any>(this.url, { message, userId });
  }

  // --- Con JWT Authorizer de Cognito ---
  askWithJwt(message: string, idToken: string) {
    // ✅ Tu Authorizer espera el formato: Bearer <TOKEN>
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    });

    return this.http.post<any>(this.url, { message }, { headers });
  }
}
