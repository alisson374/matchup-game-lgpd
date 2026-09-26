import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MainMenuComponent } from './main-menu/main-menu';
import { StartGameComponent } from './start-game/start-game';
import { CreditsComponent } from './credits/credits';
import { MatchUpGameComponent } from './match-up-game/match-up-game';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MainMenuComponent, StartGameComponent, CreditsComponent, MatchUpGameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  currentScreen = signal<'home' | 'start' | 'credits' | 'game' | 'logout'>('home');

  navigateTo(screen: 'home' | 'start' | 'credits' | 'game' | 'logout'): void {
    this.currentScreen.set(screen);
  }
}
