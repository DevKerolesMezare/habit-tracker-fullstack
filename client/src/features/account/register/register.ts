import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  errorMessage = signal('');

  registerForm = this.fb.nonNullable.group(
    {
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    const { userName, email, password } = this.registerForm.getRawValue();

    this.authService.register({ userName, email, password }).subscribe({
      next: () => {
        this.authService.getUserInfo().subscribe({
          next: () => this.router.navigateByUrl('/'),
          error: () => {
            this.authService.logout();
            this.errorMessage.set('Your account was created, but sign-in failed. Please log in.');
          },
        });
      },
      error: (error) => {
        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : 'Registration failed. Please check your details and try again.',
        );
      },
    });
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null
    : { passwordMismatch: true };
}
