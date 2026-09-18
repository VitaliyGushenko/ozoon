import { Component, Input } from '@angular/core';

export type IconButtonTone = 'neutral' | 'accept' | 'reject';

/**
 * Круглая иконка-кнопка:
 * <button ui-icon-button tone="accept" title="Принять">✓</button>
 */
@Component({
  selector: 'button[ui-icon-button], a[ui-icon-button]',
  standalone: true,
  template: '<ng-content />',
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-full);
        background: var(--glass-bg-strong);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        color: var(--text-1);
        font-size: 15px;
        line-height: 1;
        cursor: pointer;
        transition: transform 0.15s ease, background 0.2s ease,
          color 0.2s ease, box-shadow 0.2s ease;
      }

      :host(:hover) {
        transform: translateY(-1px);
      }

      :host(.ui-icon-btn--accept:hover) {
        background: var(--success);
        border-color: transparent;
        color: #fff;
      }

      :host(.ui-icon-btn--reject:hover) {
        background: var(--danger);
        border-color: transparent;
        color: #fff;
      }

      :host(.ui-icon-btn--solid-accept) {
        background: var(--success);
        border-color: transparent;
        color: #fff;
      }

      :host(.ui-icon-btn--solid-reject) {
        background: var(--danger);
        border-color: transparent;
        color: #fff;
      }
    `,
  ],
  host: {
    '[class]': 'hostClasses',
  },
})
export class UiIconButton {
  @Input() tone: IconButtonTone = 'neutral';
  /** Для тонов accept/reject: полупрозрачная или сплошная заливка. */
  @Input() solid = false;

  get hostClasses(): string {
    const classes = [`ui-icon-btn--${this.tone}`];
    if (this.solid && (this.tone === 'accept' || this.tone === 'reject')) {
      classes.push(`ui-icon-btn--solid-${this.tone}`);
    }
    return classes.join(' ');
  }
}
