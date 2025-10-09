import { Component } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// Si vas a usar JWT: importá tu CognitoService
// import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.css']
})
export class ChatAssistantComponent {
  
  reply = '';
  loading = false;
  // Para MVP sin auth:
  userIdDev = 'usuario123'; // Cambiá por tu lógica real cuando tengas Cognito integrado

  constructor(
    private assistant: AssistantService,
    // private cognito: CognitoService
  ) {}

  // --- Opción 1: MVP sin authorizer ---
  question ='';
  async sendNoAuth() {
    //this.question = this.messageControl.value;
    
    if (!this.question.trim()) return;
    this.loading = true;
    this.reply = '';
    this.assistant.askNoAuth(this.question, this.userIdDev).subscribe({
      next: (r) => { this.reply = r?.reply ?? 'Sin respuesta'; this.loading = false; },
      error: (e) => { this.reply = `Error: ${e.message}`; this.loading = false; }
    });
  }

  onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    this.sendNoAuth();
  }
}

   messageControl = new FormControl(this.question);

  // --- Opción 2: con Authorizer JWT ---
  // async sendWithJwt() {
  //   if (!this.question.trim()) return;
  //   this.loading = true;
  //   this.reply = '';
  //   const token = await this.cognito.getIdToken();
  //   if (!token) { this.reply = 'No hay token de usuario.'; this.loading = false; return; }
  //   this.assistant.askWithJwt(this.question, token).subscribe({
  //     next: (r) => { this.reply = r?.reply ?? 'Sin respuesta'; this.loading = false; },
  //     error: (e) => { this.reply = `Error: ${e.message}`; this.loading = false; }
  //   });
  // }
}
