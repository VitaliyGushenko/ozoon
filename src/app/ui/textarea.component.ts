import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FIELD_STYLES, UiInput } from './input.component';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  template: `
    <span class="ui-field">
      @if (label) {
        <span class="ui-field__label">{{ label }}</span>
      }
      <textarea
        class="ui-field__control"
        rows="4"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value ?? ''"
        (input)="handleInput($event)"
        (blur)="onTouched?.()"
      ></textarea>
      @if (hint) {
        <span class="ui-field__hint">{{ hint }}</span>
      }
    </span>
  `,
  styles: [FIELD_STYLES],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextarea),
      multi: true,
    },
  ],
})
export class UiTextarea extends UiInput {
  override handleInput(event: Event): void {
    this.emit((event.target as HTMLTextAreaElement).value);
  }
}
