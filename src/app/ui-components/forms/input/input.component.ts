import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
  Self,
  forwardRef,
} from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import { Form } from 'src/app/commons/form';
import { BaseControlComponent } from 'src/app/directives/base-control';
import { InputConfig } from './types';
import { config } from './types/config';

@Component({
  selector: 'base-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})
export class InputComponent extends BaseControlComponent<string> {
  config: InputConfig = config;
  @Input() label: string = '';
  @Input() minLength: number = Form.defaultInputMinLength;
  @Input() maxLength: number = Form.defaultInputMaxLength;
  @Input() placeholder: string = '';

  constructor(@Optional() @Self() private controlDir: NgControl) {
    super();
    if (controlDir) {
      controlDir.valueAccessor = this;
    }
  }

  ngAfterViewInit() {
    console.log('label', this.label);
  }

  get isHasRequiredValidator() {
    return Form.hasRequiredValidator(this.controlDir, 'required');
  }

  get errors() {
    return this.controlDir.control?.errors;
  }

  get isControlTouched() {
    return this.controlDir?.control?.touched;
  }

  get isError() {
    return this.isControlTouched && this.errors;
  }

  get isRequired() {
    return this.isError && this.errors && this.errors['required'];
  }

  get isErrorMinLength() {
    return this.isControlTouched && this.errors?.['minlength'];
  }

  get errorMinLengthValue(): Record<string, string> {
    return this.controlDir?.control?.errors?.['minlength'];
  }

  get isErrorMaxLength() {
    return this.isControlTouched && this.errors?.['maxlength'];
  }

  get errorMaxLengthValue(): Record<string, string> {
    return this.controlDir?.control?.errors?.['maxlength'];
  }

  get isErrorEmail() {
    return this.isControlTouched && this.errors?.['email'];
  }

  get isMaxLength() {
    return this.isError && this.errors && this.errors['maxLength'];
  }

  onBlur(): void {
    this.onTouched();
  }
}
