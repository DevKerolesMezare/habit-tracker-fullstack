import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment.development';
import { ChangePassword } from './change-password';

describe('ChangePassword', () => {
  let fixture: ComponentFixture<ChangePassword>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChangePassword);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('requires all fields and validates strength and matching passwords', () => {
    const form = fixture.componentInstance.passwordForm;
    expect(form.invalid).toBe(true);

    form.setValue({
      currentPassword: 'current-password',
      newPassword: 'short',
      confirmPassword: 'short',
    });
    expect(form.controls.newPassword.hasError('minlength')).toBe(true);
    fixture.componentInstance.onSubmit();
    http.expectNone(`${environment.apiUrl}Users/me/password`);

    form.setValue({
      currentPassword: 'current-password',
      newPassword: 'new-password',
      confirmPassword: 'different-password',
    });
    expect(form.hasError('fieldsMismatch')).toBe(true);
    fixture.componentInstance.onSubmit();
    http.expectNone(`${environment.apiUrl}Users/me/password`);

    form.setValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    expect(form.invalid).toBe(true);
  });

  it('shows backend errors when the current password is rejected', () => {
    fixture.componentInstance.passwordForm.setValue({
      currentPassword: 'incorrect-password',
      newPassword: 'new-password',
      confirmPassword: 'new-password',
    });
    fixture.componentInstance.onSubmit();

    const request = http.expectOne(`${environment.apiUrl}Users/me/password`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      currentPassword: 'incorrect-password',
      newPassword: 'new-password',
    });
    request.flush('Current password is incorrect.', {
      status: 400,
      statusText: 'Bad Request',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Current password is incorrect.',
    );
  });

  it('clears fields and reports success after changing the password', () => {
    fixture.componentInstance.passwordForm.setValue({
      currentPassword: 'current-password',
      newPassword: 'new-password',
      confirmPassword: 'new-password',
    });
    fixture.componentInstance.onSubmit();

    const request = http.expectOne(`${environment.apiUrl}Users/me/password`);
    request.flush(null);
    fixture.detectChanges();

    expect(fixture.componentInstance.passwordForm.getRawValue()).toEqual({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    expect(fixture.nativeElement.textContent).toContain(
      'Your password has been changed.',
    );
  });
});
