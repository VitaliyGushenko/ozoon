import { Component, Input } from '@angular/core';

/** Пустое состояние: <ui-empty-state icon="📦" text="Товаров пока нет"></ui-empty-state> */
@Component({
  selector: 'ui-empty-state',
  standalone: true,
  template: `
    <div class="ui-empty">
      @if (icon) {
        <span class="ui-empty__icon">{{ icon }}</span>
      }
      <p>{{ text }}</p>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .ui-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 56px 16px;
        text-align: center;
        color: var(--text-2);
      }

      .ui-empty__icon {
        font-size: 44px;
      }

      p {
        margin: 0;
        font-size: 0.98rem;
      }
    `,
  ],
})
export class UiEmptyState {
  @Input() icon = '';
  @Input() text = '';
}
