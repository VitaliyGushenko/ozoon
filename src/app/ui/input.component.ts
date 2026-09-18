import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { UiFieldBase } from './field-base';

export const FIELD_STYLES = `
  .ui-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.9rem;
    color: var(--text-2);
  }

  .ui-field__label {
    font-weight: 500;
    color: var(--text-1);
  }

  .ui-field__control {
    padding: 11px 14px;
    border: 1px solid var(--field-border);
    border-radius: var(--radius-sm);
    background: var(--field-bg);
    color: var(--text-1);
    font: inherit;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .ui-field__control::placeholder {
    color: var(--text-2);
  }

  .ui-field__control:focus {
    border-color: var(--field-border-focus);
  }

  .ui-field__control:disabled {
    opacity: 0.5;
  }

  .ui-field__hint {
    font-size: 0.8rem;
  }

  select.ui-field__control {
    cursor: pointer;
  }

  textarea.ui-field__control {
    resize: vertical;
  }
`;

/**
 * Текстовое поле в стеклянном стиле:
 * <ui-input label="Название" [(ngModel)]="title"></ui-input>
 */
@Component({
  selector: 'ui-input',
  standalone: true,
  template: `
    <span class="ui-field">
      @if (label) {
        <span class="ui-field__label">{{ label }}</span>
      }
      <input
        class="ui-field__control"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value ?? ''"
        (input)="handleInput($event)"
        (blur)="onTouched?.()"
      />
      @if (hint) {
        <span class="ui-field__hint">{{ hint }}</span>
      }
    </span>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
    FIELD_STYLES,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInput),
      multi: true,
    },
  ],
})
export class UiInput extends UiFieldBase implements ControlValueAccessor {
  @Input() type = 'text';

  handleInput(event: Event): void {
    this.emit((event.target as HTMLInputElement).value);
  }
}
