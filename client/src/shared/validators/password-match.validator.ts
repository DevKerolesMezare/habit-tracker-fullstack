import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fieldsMatchValidator(
  firstField: string,
  secondField: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.get(firstField)?.value === control.get(secondField)?.value
      ? null
      : { fieldsMismatch: true };
}
