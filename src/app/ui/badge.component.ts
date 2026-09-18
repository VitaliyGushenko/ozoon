import { Component, Input } from '@angular/core';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger';

/** Бейдж: <ui-badge tone="accent">Продавец</ui-badge> */
@Component({
  selector: 'ui-badge',
  standalone: true,
  template: '<ng-content />',
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        padding: 3px 12px;
        border-radius: var(--radius-full);
        font-size: 0.78rem;
        font-weight: 600;
        line-height: 1.5;
        white-space: nowrap;
        background: var(--glass-bg-soft);
        border: 1px solid var(--glass-border);
        color: var(--text-2);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
      }

      :host(.ui-badge--accent) {
        background: var(--accent-soft);
        border-color: transparent;
        color: var(--accent);
      }

      :host(.ui-badge--success) {
        background: var(--success-soft);
        border-color: transparent;
        color: var(--success);
      }

      :host(.ui-badge--danger) {
        background: var(--danger-soft);
        border-color: transparent;
        color: var(--danger);
      }
    `,
  ],
  host: {
    '[class]': `'ui-badge--' + tone`,
  },
})
export class UiBadge {
  @Input() tone: BadgeTone = 'neutral';
}
