// src/app/components/chat-assistant/chat-assistant.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/authServices/auth.service';
import { AssistantService } from '../../services/assistant.service';

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
    await this.auth.debugPrintTokens();

    console.log('[CHAT] send() called. question =', this.question);

    if (!this.question.trim()) {
      console.log('[CHAT] empty question -> return');
      return;
    }

    this.loading = true;
    this.reply = '';

    try {
      // ✅ Obtener el Access Token en lugar del ID Token
      const accessToken = await this.auth.getAccessToken();
      console.log('[CHAT] accessToken =', accessToken?.substring(0, 30) + '...');

      // ✅ Verificación de token nulo
      if (!accessToken) {
        console.error('[CHAT] No se obtuvo access token de sesión.');
        this.reply = 'No hay sesión activa o el token expiró.';
        this.loading = false;
        return;
      }

      console.log('[CHAT] Enviando pregunta al asistente...');

      // ✅ Enviar Access Token al backend (API Gateway lo valida)
      this.assistant.askWithJwt(this.question, accessToken).subscribe({
        next: (r) => {
          console.log('[CHAT] assistant reply:', r);
          this.reply = r?.reply ?? 'Sin respuesta recibida.';
          this.loading = false;
        },
        error: (e) => {
          console.error('[CHAT] HTTP error:', e);
          const status = e?.status ? ` (HTTP ${e.status})` : '';
          const message = e?.error?.message || e?.message || 'Error desconocido.';
          this.reply = `Error${status}: ${message}`;
          this.loading = false;
        },
      });
    } catch (error) {
      console.error('[CHAT] Error inesperado al enviar:', error);
      this.reply = 'Ocurrió un error inesperado. Revisá la consola para más detalles.';
      this.loading = false;
    }
  }
}
