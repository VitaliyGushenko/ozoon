import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
/** Общая логика форм-контролей: ngModel/CVA, disabled, value-биндинги. */
export abstract class UiFieldBase implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() placeholder = '';

  /** Текущее значение: пишется через ngModel или напрямую через [value]. */
  @Input() value: unknown = null;
  /** Событие изменения — для использования без ngModel: [value] + (valueChange). */
  @Output() valueChange = new EventEmitter<unknown>();

  disabled = false;

  onChange?: (value: unknown) => void;
  onTouched?: () => void;

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected emit(value: unknown): void {
    this.value = value;
    this.valueChange.emit(value);
    this.onChange?.(value);
  }
}
