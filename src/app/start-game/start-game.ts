import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-start-game',
  styleUrl: './start-game.css',
  templateUrl: './start-game.html',
})
export class StartGameComponent {
  back = output<void>();
  startMatch = output<void>();
  selectedChar = signal<number | null>(null);

  isConnecting = signal(false);
  connectionSuccess = signal(false);

  characters = [
    { id: 1, name: 'Auditor DPO', desc: 'Especialista em conformidade regulatória e canais ANPD.', color: 'from-cyan-600 to-blue-900' },
    { id: 2, name: 'Controlador de Dados', desc: 'Foco em governança corporativa e decisões de tratamento.', color: 'from-emerald-600 to-teal-900' },
    { id: 3, name: 'Analista Operacional', desc: 'Execução técnica de anonimização e eliminação segura.', color: 'from-purple-600 to-pink-900' }
  ];

  selectChar(id: number): void {
    if (this.isConnecting() || this.connectionSuccess()) return;
    this.selectedChar.set(id);
  }

  startGame(): void {
    if (!this.selectedChar()) return;

    this.isConnecting.set(true);

    setTimeout(() => {
      this.isConnecting.set(false);
      this.connectionSuccess.set(true);

      setTimeout(() => {
        this.connectionSuccess.set(false);
        this.startMatch.emit();
      }, 1500);
    }, 2000);
  }

  onBack(): void {
    if (this.isConnecting() || this.connectionSuccess()) return;
    this.back.emit();
  }
}
