import { Component } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { AuthService } from '../../services/authServices/auth.service';

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.css'],
})
export class ChatAssistantComponent {
  question = '';
  reply = '';
  loading = false;

  constructor(
    private assistant: AssistantService,
    private auth: AuthService
  ) {}

  async sendQuestion() {
    this.loading = true;
    this.reply = '';

    try {
      const idToken = await this.auth.getIdToken();
      if (!idToken) {
        this.reply = 'No hay sesión activa o el token expiró.';
        this.loading = false;
        return;
      }

      this.assistant.askWithJwt(this.question, idToken).subscribe({
        next: (res: any) => {
          this.reply = res.reply || 'Sin respuesta del asistente.';
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al enviar pregunta:', err);
          this.reply = 'Error al comunicar con el asistente.';
          this.loading = false;
        },
      });
    } catch (e) {
      console.error('Error general al enviar pregunta:', e);
      this.reply = 'Error interno al enviar la pregunta.';
      this.loading = false;
    }
  }
}
