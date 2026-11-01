import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ProfileService, UserProfile } from '../../../../core/services/profile';
import { getHttpErrorDetails } from '../../../../core/utils/http-error';

const emailValidators = Validators.compose([
  Validators.required,
  Validators.email,
  Validators.maxLength(100),
])!;

const trimmedEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (typeof control.value !== 'string') {
    return { required: true };
  }

  const normalizedControl = new FormControl(control.value.trim());
  return emailValidators(normalizedControl);
};

@Component({
  selector: 'app-profile-information',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './profile-information.html',
})
export class ProfileInformation implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  profile = signal<UserProfile | null>(null);
  isLoading = signal(true);
  isEditing = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  profileForm = this.fb.nonNullable.group({
    userName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
    email: ['', trimmedEmailValidator],
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.setProfile(profile);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const details = getHttpErrorDetails(error);
        this.errorMessage.set(
          details.message ??
            details.validationErrors ??
            details.detail ??
            details.title ??
            'Failed to load your profile. Please try again.',
        );
        this.isLoading.set(false);
      },
    });
  }

  startEditing() {
    const profile = this.profile();
    if (!profile) {
      return;
    }

    this.profileForm.reset({
      userName: profile.userName,
      email: profile.email,
    });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isEditing.set(true);
  }

  cancelEditing() {
    this.isEditing.set(false);
    this.errorMessage.set('');
    this.profileForm.reset({
      userName: this.profile()?.userName ?? '',
      email: this.profile()?.email ?? '',
    });
  }

  hasChanges(): boolean {
    const profile = this.profile();
    const value = this.profileForm.getRawValue();

    return (
      !!profile &&
      (value.userName.trim() !== profile.userName ||
        value.email.trim().toLowerCase() !== profile.email)
    );
  }

  onSubmit() {
    if (this.isSubmitting()) {
      return;
    }

    const profile = this.profile();
    if (!profile) {
      return;
    }

    const value = this.profileForm.getRawValue();
    this.profileForm.patchValue(
      {
        userName: value.userName.trim(),
        email: value.email.trim(),
      },
      { emitEvent: false },
    );

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const normalizedValue = this.profileForm.getRawValue();
    const update = {
      userName: normalizedValue.userName,
      email: normalizedValue.email.toLowerCase(),
    };

    if (update.userName === profile.userName && update.email === profile.email) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.profileService.updateProfile(profile.userId, update).subscribe({
      next: (updatedProfile) => {
        this.setProfile(updatedProfile);
        this.isEditing.set(false);
        this.isSubmitting.set(false);
        this.successMessage.set('Your profile has been updated.');
      },
      error: (error: HttpErrorResponse) => {
        const details = getHttpErrorDetails(error);
        this.errorMessage.set(
          details.message ??
            details.validationErrors ??
            details.detail ??
            details.title ??
            'Failed to update your profile. Please try again.',
        );
        this.isSubmitting.set(false);
      },
    });
  }

  private setProfile(profile: UserProfile) {
    this.profile.set(profile);
    this.profileForm.reset({
      userName: profile.userName,
      email: profile.email,
    });
  }
}
