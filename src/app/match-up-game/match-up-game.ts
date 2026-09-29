import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';

@Component({
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-match-up-game',
  styleUrl: './match-up-game.css',
  templateUrl: './match-up-game.html',
})
export class MatchUpGameComponent implements OnInit {
  back = output<void>();
  private destroyRef = inject(DestroyRef);

  timeLeft = signal(90);
  score = signal(0);
  gameState = signal<'playing' | 'won' | 'lost'>('playing');

  leftItems = signal<any[]>([]);
  rightItems = signal<any[]>([]);

  selectedLeft = signal<any | null>(null);
  selectedRight = signal<any | null>(null);

  totalPairs = 10;
  private timerInterval: any;

  readonly PAIRS = [
    { id: '1', left: 'O que é a LGPD?', right: 'É a lei brasileira que estabelece regras para o uso e a proteção de dados pessoais.' },
    { id: '2', left: 'Dado Pessoal', right: 'Qualquer informação que identifique ou possa identificar uma pessoa viva (ex: CPF, e-mail, IP).' },
    { id: '3', left: 'Dado Pessoal Sensível', right: 'Qualquer informação a qual pode levar a vulnerabilidade ou descriminação do individuo, sendo de cunho mais intimo da pessoa.' },
    { id: '4', left: 'Dado Anonimizado', right: 'Dado modificado para que não se possa identificar seu titular.' },
    { id: '5', left: 'Titular', right: 'Pessoa a quem os dados se referem.' },
    { id: '6', left: 'Controlador', right: 'Quem decide com o dados pessoais serão tratados.' },
    { id: '7', left: 'Operador', right: 'Quem faz o tratamento dos dados em nome do controlador.' },
    { id: '8', left: 'DPO (Encarregado)', right: 'A pessoa que atua como canal de comunicação entre a empresa, os titulares e a ANPD.' },
    { id: '9', left: 'ANPD', right: 'Órgão do governo responsável por zelar, implementar e fiscalizar o cumprimento da lei no Brasil.' },
    { id: '10', left: 'Eliminação de Dados', right: 'O direito do titular de solicitar a exclusão de seus dados do sistema da empresa.' },
    { id: '11', left: 'Consentimento', right: 'Autorização manifesta, livre, informada e inequívoca do titular para o uso dos seus dados.' },
    { id: '12', left: 'Qual o objetivo da LGPD?', right: 'proteger os dados pessoais e a privacidade das pessoas' },
    { id: '13', left: 'Quais os benefícios da LGPD', right: 'maior segurança, transparência e controle sobre o uso de dados.' },
    { id: '14', left: 'Quais as punições para quem não aplica?', right: 'podem incluir advertência, multa de até 2% do faturamento, bloqueio ou eliminação dos dados pessoais, entre outras sanções.' }
  ];

  ngOnInit(): void {
    this.totalPairs = this.PAIRS.length;
    this.initGame();
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  initGame(): void {
    this.clearTimer();
    this.timeLeft.set(90);
    this.score.set(0);
    this.gameState.set('playing');
    this.selectedLeft.set(null);
    this.selectedRight.set(null);

    const left = this.PAIRS.map(p => ({ id: 'l-' + p.id, text: p.left, matchId: p.id, isMatched: false, state: 'idle' }));
    const right = this.PAIRS.map(p => ({ id: 'r-' + p.id, text: p.right, matchId: p.id, isMatched: false, state: 'idle' }));

    this.leftItems.set(this.shuffleArray(left));
    this.rightItems.set(this.shuffleArray(right));

    this.startTimer();
  }

  shuffleArray(array: any[]): any[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.gameState() !== 'playing') return;

      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.gameState.set('lost');
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  selectItem(side: 'left' | 'right', item: any): void {
    if (item.isMatched || this.gameState() !== 'playing') return;

    if (side === 'left') {
      if (this.selectedLeft()?.id === item.id) {
        this.updateItemState('left', item.id, 'idle');
        this.selectedLeft.set(null);
        return;
      }
      if (this.selectedLeft()) this.updateItemState('left', this.selectedLeft().id, 'idle');
      this.selectedLeft.set(item);
      this.updateItemState('left', item.id, 'selected');
    } else {
      if (this.selectedRight()?.id === item.id) {
        this.updateItemState('right', item.id, 'idle');
        this.selectedRight.set(null);
        return;
      }
      if (this.selectedRight()) this.updateItemState('right', this.selectedRight().id, 'idle');
      this.selectedRight.set(item);
      this.updateItemState('right', item.id, 'selected');
    }

    this.checkMatch();
  }

  checkMatch(): void {
    const left = this.selectedLeft();
    const right = this.selectedRight();

    if (left && right) {
      if (left.matchId === right.matchId) {
        this.updateItemState('left', left.id, 'matched', true);
        this.updateItemState('right', right.id, 'matched', true);
        this.score.update(s => s + 1);
        this.selectedLeft.set(null);
        this.selectedRight.set(null);

        if (this.score() === this.totalPairs) {
          this.gameState.set('won');
          this.clearTimer();
        }
      } else {
        this.updateItemState('left', left.id, 'error');
        this.updateItemState('right', right.id, 'error');

        setTimeout(() => {
          this.updateItemState('left', left.id, 'idle');
          this.updateItemState('right', right.id, 'idle');
        }, 600);

        this.selectedLeft.set(null);
        this.selectedRight.set(null);
      }
    }
  }

  updateItemState(side: 'left' | 'right', id: string, state: string, isMatched = false): void {
    if (side === 'left') {
      this.leftItems.update(items => items.map(i => i.id === id ? { ...i, state, isMatched: isMatched || i.isMatched } : i));
    } else {
      this.rightItems.update(items => items.map(i => i.id === id ? { ...i, state, isMatched: isMatched || i.isMatched } : i));
    }
  }

  onBack(): void {
    this.clearTimer();
    this.back.emit();
  }
}
