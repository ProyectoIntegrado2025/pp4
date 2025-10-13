import { Component } from '@angular/core';
import { AuthService } from '../../services/authServices/auth.service';
import { AssistantService } from '../../services/assistant.service';
import { ApiGatewayService } from 'src/app/services/api.gateway.service';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.css']
})
export class ChatAssistantComponent {
  question = '';
  reply = '';
  loading = false;

  constructor(
    private assistant: AssistantService,
    private auth: AuthService
  ) {}

async send() {
  console.log('[CHAT] send() called. question =', this.question);

  if (!this.question.trim()) {
    console.log('[CHAT] empty question -> return');
    return;
  }

  this.loading = true;
  this.reply = '';

  try {
    const token = await this.auth.getIdToken();
    console.log('[CHAT] idToken =', token);

    // ✅ Verificación de token nulo
    if (!token) {
      console.error('[CHAT] No se obtuvo token de sesión.');
      this.reply = 'No hay sesión iniciada.';
      this.loading = false;
      return;
    }

    console.log('[CHAT] Enviando pregunta al asistente...');
    this.assistant.askWithJwt(this.question, token).subscribe({
      next: (r) => {
        console.log('[CHAT] assistant reply:', r);
        this.reply = r?.reply ?? 'Sin respuesta';
        this.loading = false;
      },
      error: (e) => {
        console.error('[CHAT] HTTP error:', e);
        this.reply = `Error: ${e.message}`;
        this.loading = false;
      },
    });
  } catch (error) {
    console.error('[CHAT] Error inesperado al enviar:', error);
    this.reply = 'Ocurrió un error inesperado.';
    this.loading = false;
  }
}


}
