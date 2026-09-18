import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FIELD_STYLES } from './input.component';
import { UiFieldBase } from './field-base';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Выпадающий список:
 * <ui-select label="Категория" [options]="categoryOptions" [(ngModel)]="category">
 * </ui-select>
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  template: `
    <span class="ui-field">
      @if (label) {
        <span class="ui-field__label">{{ label }}</span>
      }
      <select
        class="ui-field__control"
        [disabled]="disabled"
        [value]="value ?? ''"
        (change)="handleChange($event)"
        (blur)="onTouched?.()"
      >
        @if (placeholder) {
          <option value="" disabled>{{ placeholder }}</option>
        }
        @for (option of options; track option.value) {
          <option [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </option>
        }
      </select>
      @if (hint) {
        <span class="ui-field__hint">{{ hint }}</span>
      }
    </span>
  `,
  styles: [FIELD_STYLES],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelect),
      multi: true,
    },
  ],
})
export class UiSelect extends UiFieldBase implements ControlValueAccessor {
  /** Доступные варианты; value — то, что попадает в модель. */
  @Input() options: SelectOption[] = [];

  handleChange(event: Event): void {
    this.emit((event.target as HTMLSelectElement).value);
  }
}
