import { Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'glass' | 'danger' | 'ghost';
export type ButtonSize = 'md' | 'sm';

/**
 * Кнопка. Используется как атрибут на нативных button и a:
 * <button ui-button variant="danger">Удалить</button>
 */
@Component({
  selector: 'button[ui-button], a[ui-button]',
  standalone: true,
  template: '<ng-content />',
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        font: inherit;
        font-size: 0.95rem;
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        text-decoration: none;
        padding: 12px 22px;
        transition: transform 0.15s ease, box-shadow 0.2s ease,
          background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
      }

      :host(.ui-btn--md) {
        padding: 12px 22px;
      }

      :host(.ui-btn--sm) {
        padding: 8px 14px;
        font-size: 0.85rem;
        border-radius: var(--radius-sm);
      }

      :host(.ui-btn--block) {
        width: 100%;
      }

      :host(.ui-btn--primary) {
        background: var(--accent-gradient);
        color: var(--accent-text);
        box-shadow: 0 4px 18px var(--accent-soft);
      }

      :host(.ui-btn--primary:hover:not([disabled])) {
        transform: translateY(-1px);
        box-shadow: 0 8px 26px var(--accent-soft);
      }

      :host(.ui-btn--glass) {
        background: var(--glass-bg-strong);
        backdrop-filter: blur(var(--glass-blur));
        -webkit-backdrop-filter: blur(var(--glass-blur));
        border-color: var(--glass-border);
        color: var(--text-1);
      }

      :host(.ui-btn--glass:hover:not([disabled])) {
        background: var(--glass-bg);
        transform: translateY(-1px);
      }

      :host(.ui-btn--danger) {
        background: var(--danger-soft);
        border-color: transparent;
        color: var(--danger);
      }

      :host(.ui-btn--danger:hover:not([disabled])) {
        background: var(--danger);
        color: #fff;
      }

      :host(.ui-btn--ghost) {
        background: transparent;
        color: var(--text-2);
      }

      :host(.ui-btn--ghost:hover:not([disabled])) {
        color: var(--text-1);
        background: var(--glass-bg-soft);
      }

      :host([disabled]) {
        opacity: 0.5;
        cursor: default;
      }

      :host(:focus-visible) {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
    `,
  ],
  host: {
    '[class]': 'hostClasses',
  },
})
export class UiButton {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() block = false;

  get hostClasses(): string {
    return [
      'ui-btn',
      `ui-btn--${this.variant}`,
      `ui-btn--${this.size}`,
      ...(this.block ? ['ui-btn--block'] : []),
    ].join(' ');
  }
}
