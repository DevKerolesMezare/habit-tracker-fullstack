import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProfileService } from '../../../../core/services/profile';
import { getHttpErrorDetails } from '../../../../core/utils/http-error';
import { fieldsMatchValidator } from '../../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: fieldsMatchValidator('newPassword', 'confirmPassword') },
  );

  onSubmit() {
    if (this.passwordForm.invalid || this.isSubmitting()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.profileService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        this.successMessage.set('Your password has been changed.');
        this.isSubmitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const details = getHttpErrorDetails(error);
        this.errorMessage.set(
          details.message ??
            details.validationErrors ??
            details.detail ??
            details.title ??
            'Failed to change your password. Please try again.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
