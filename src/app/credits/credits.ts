import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-credits',
  styleUrl: './credits.css',
  templateUrl: './credits.html',
})
export class CreditsComponent {
  back = output<void>();

  onBack(): void {
    this.back.emit();
  }
}
