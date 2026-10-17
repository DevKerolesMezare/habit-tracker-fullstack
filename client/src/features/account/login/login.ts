
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  errorMessage = signal('');

  returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authService.getUserInfo().subscribe({
          next: () => this.router.navigateByUrl(this.returnUrl),
          error: () => {
            this.authService.logout();
            this.errorMessage.set('Login failed. Please try again.');
          },
        });
      },
      error: (error) => {
        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : 'Invalid email or password.',
        );
      },
    });
  }
}
