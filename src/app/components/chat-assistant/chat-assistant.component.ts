import { Component } from '@angular/core';
import { AssistantService } from '../../services/assistant.service';
import { AuthService } from '../../services/authServices/auth.service';

interface ChatMsg {
  sender: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chat-assistant',
  templateUrl: './chat-assistant.component.html',
  styleUrls: ['./chat-assistant.component.css'],
})
export class ChatAssistantComponent {
  isOpen = false;
  question = '';
  reply = '';
  loading = false;
  messages: ChatMsg[] = [];

  constructor(
    private assistant: AssistantService,
    private auth: AuthService
  ) {}

toggleChat() {
  this.isOpen = !this.isOpen;

  if (this.isOpen) {
    // Si no hay mensajes, muestra el mensaje inicial
    if (this.messages.length === 0) {
      this.messages.push({
        sender: 'assistant',
        text: '👋 Hola, soy ZenkiBot. ¿En qué puedo ayudarte hoy?',
      });
    }

    // foco al input
    setTimeout(() => {
      const el = document.getElementById('zenki-input');
      el?.focus();
    }, 0);
  }
}


  async sendQuestion() {
    const q = this.question.trim();
    if (!q || this.loading) return;

    this.messages.push({ sender: 'user', text: q });
    this.loading = true;
    this.question = '';

    try {
      const idToken = await this.auth.getIdToken();

      // 🛡️ Validamos que el token no sea null
      if (!idToken) {
        this.messages.push({
          sender: 'assistant',
          text: '⚠️ No hay sesión activa o el token expiró. Inicia sesión para continuar.',
        });
        this.loading = false;
        return;
      }

      // ✅ Si el token existe, enviamos la consulta normalmente
      this.assistant.askWithJwt(q, idToken).subscribe({
        next: (res: any) => {
          const text = (res?.reply ?? '').toString();
          this.reply = text;
          this.messages.push({ sender: 'assistant', text });
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error al enviar pregunta:', err);
          const text = 'Error al comunicar con el asistente.';
          this.reply = text;
          this.messages.push({ sender: 'assistant', text });
          this.loading = false;
        },
      });
    } catch (e: any) {
      console.error('Error general al enviar la pregunta:', e);
      const text = 'Error interno al enviar la pregunta.';
      this.reply = text;
      this.messages.push({ sender: 'assistant', text });
      this.loading = false;
    }
  }
}
