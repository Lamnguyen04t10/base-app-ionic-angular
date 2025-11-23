import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { Directive, Optional, Self } from '@angular/core';

@Directive()
export abstract class BaseControlComponent<T> implements ControlValueAccessor {
  constructor() {}
  value!: T;
  disabled = false;

  private onChange = (value: T) => {};
  public onTouched = () => {};

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected updateValue(value: T) {
    this.value = value;
    this.onChange(value);
  }
}
