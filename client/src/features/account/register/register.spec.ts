import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Register } from './register';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
  });

  it('requires matching password confirmation', () => {
    const form = fixture.componentInstance.registerForm;
    form.setValue({
      userName: 'habit-user',
      email: 'user@example.com',
      password: 'valid-password',
      confirmPassword: 'different-password',
    });

    expect(form.hasError('fieldsMismatch')).toBe(true);
    expect(form.invalid).toBe(true);

    form.controls.confirmPassword.setValue('valid-password');

    expect(form.hasError('fieldsMismatch')).toBe(false);
    expect(form.valid).toBe(true);
  });
});
