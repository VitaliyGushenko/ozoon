import { Component, Input } from '@angular/core';

/**
 * Стеклянная карточка-контейнер:
 * <ui-card padding="lg">…</ui-card>
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  template: '<ng-content />',
  styles: [
    `
      :host {
        display: block;
        background: var(--glass-bg);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-card);
        transition: box-shadow 0.25s ease, transform 0.25s ease;
      }

      :host(.ui-card--padding-md) {
        padding: 20px;
      }

      :host(.ui-card--padding-lg) {
        padding: 28px;
      }
    `,
  ],
  host: {
    '[class]': `'ui-card--padding-' + padding`,
  },
})
export class UiCard {
  @Input() padding: 'none' | 'md' | 'lg' = 'none';
}
