import { FormControl, FormGroup } from '@angular/forms';

import { fieldsMatchValidator } from './password-match.validator';

describe('fieldsMatchValidator', () => {
  it('accepts equal password fields', () => {
    const form = new FormGroup(
      {
        newPassword: new FormControl('same-password'),
        confirmPassword: new FormControl('same-password'),
      },
      { validators: fieldsMatchValidator('newPassword', 'confirmPassword') },
    );

    expect(form.valid).toBe(true);
  });

  it('rejects different password fields', () => {
    const form = new FormGroup(
      {
        password: new FormControl('first-password'),
        confirmPassword: new FormControl('second-password'),
      },
      { validators: fieldsMatchValidator('password', 'confirmPassword') },
    );

    expect(form.hasError('fieldsMismatch')).toBe(true);
  });
});
