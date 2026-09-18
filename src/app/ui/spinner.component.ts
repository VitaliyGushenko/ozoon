import { Component } from '@angular/core';

/** Индикатор загрузки: <ui-spinner /> */
@Component({
  selector: 'ui-spinner',
  standalone: true,
  template: '<span class="ui-spinner"></span>',
  styles: [
    `
      :host {
        display: block;
        text-align: center;
        padding: 56px 0;
      }

      .ui-spinner {
        display: inline-block;
        width: 34px;
        height: 34px;
        border: 3px solid var(--accent-soft);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: ui-spin 0.8s linear infinite;
      }

      @keyframes ui-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class UiSpinner {}
