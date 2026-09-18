import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { UiFieldBase } from './field-base';

/**
 * Чекбокс:
 * <ui-checkbox label="Продавец" [(ngModel)]="isSeller"></ui-checkbox>
 */
@Component({
  selector: 'ui-checkbox',
  standalone: true,
  template: `
    <label class="ui-check">
      <input
        type="checkbox"
        [checked]="value === true"
        [disabled]="disabled"
        (change)="handleChange($event)"
        (blur)="onTouched?.()"
      />
      @if (label) {
        <span>{{ label }}</span>
      }
      <ng-content />
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ui-check {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 0.92rem;
        color: var(--text-1);
      }

      input {
        width: 17px;
        height: 17px;
        accent-color: var(--accent);
        cursor: pointer;
      }

      input:disabled {
        cursor: default;
        opacity: 0.5;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckbox),
      multi: true,
    },
  ],
})
export class UiCheckbox extends UiFieldBase implements ControlValueAccessor {
  @Input() override label = '';

  handleChange(event: Event): void {
    this.emit((event.target as HTMLInputElement).checked);
  }
}