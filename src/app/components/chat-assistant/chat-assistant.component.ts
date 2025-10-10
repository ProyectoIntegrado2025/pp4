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
    if (!this.question.trim()) return;
    this.loading = true;
    this.reply = '';

    const token = await this.auth.getIdToken();
    if (!token) { this.reply = 'No hay sesión iniciada.'; this.loading = false; return; }

    this.assistant.askWithJwt(this.question, token).subscribe({
      next: (r) => { this.reply = r?.reply ?? 'Sin respuesta'; this.loading = false; },
      error: (e) => { this.reply = `Error: ${e.message}`; this.loading = false; }
    });
  }
}
