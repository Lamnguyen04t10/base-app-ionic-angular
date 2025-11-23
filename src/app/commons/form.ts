import { NgControl, Validators } from '@angular/forms';

export namespace Form {
  export const defaultInputMaxLength = 255;
  export const defaultInputMinLength = 1;

  export const hasRequiredValidator = (controlDir: NgControl, validatorKey: string): boolean => {
    const control = controlDir?.control;
    if (!control?.validator) return false;

    const testControl = { ...control, value: null } as any;

    const errors = control.validator(testControl);

    return !!errors?.[validatorKey];
  };
}
