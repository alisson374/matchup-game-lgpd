import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main-menu',
  styleUrl: './main-menu.css',
  templateUrl: './main-menu.html',
})
export class MainMenuComponent {
  navigate = output<'start' | 'credits'>();
  logout = output<void>();
  showExitModal = signal(false);

  onNavigate(target: 'start' | 'credits'): void {
    this.navigate.emit(target);
  }

  toggleExitModal(show: boolean): void {
    this.showExitModal.set(show);
  }

  confirmExit(): void {
    this.showExitModal.set(false);
    this.logout.emit();
  }
}
