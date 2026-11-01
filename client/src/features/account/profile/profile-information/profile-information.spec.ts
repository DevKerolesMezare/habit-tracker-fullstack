import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment.development';
import { ProfileInformation } from './profile-information';

describe('ProfileInformation', () => {
  let fixture: ComponentFixture<ProfileInformation>;
  let http: HttpTestingController;

  const savedProfile = {
    userId: 7,
    userName: 'habit-user',
    email: 'user@example.com',
    createdAt: '2026-01-15T00:00:00',
    isActive: true,
  };

  beforeEach(async () => {
    localStorage.setItem('token', 'test-token');
    await TestBed.configureTestingModule({
      imports: [ProfileInformation],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProfileInformation);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('token');
  });

  function loadSavedProfile() {
    const request = http.expectOne(`${environment.apiUrl}Users/me`);
    request.flush(savedProfile);
    fixture.detectChanges();
  }

  it('loads and displays the account profile', () => {
    expect(fixture.nativeElement.textContent).toContain('Loading your profile...');

    loadSavedProfile();

    expect(fixture.nativeElement.textContent).toContain('habit-user');
    expect(fixture.nativeElement.textContent).toContain('user@example.com');
  });

  it('shows a useful error when profile loading fails', () => {
    const request = http.expectOne(`${environment.apiUrl}Users/me`);
    request.flush('Profile unavailable.', {
      status: 500,
      statusText: 'Server Error',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Profile unavailable.');
    expect(fixture.nativeElement.textContent).toContain('Try again');
  });

  it('validates, skips unchanged updates, and normalizes a successful update', () => {
    loadSavedProfile();
    fixture.componentInstance.startEditing();
    fixture.detectChanges();

    fixture.componentInstance.profileForm.setValue({
      userName: '   ',
      email: 'invalid',
    });
    fixture.componentInstance.onSubmit();
    expect(fixture.componentInstance.profileForm.invalid).toBe(true);
    http.expectNone(`${environment.apiUrl}Users/${savedProfile.userId}`);

    fixture.componentInstance.profileForm.setValue({
      userName: 'habit-user ',
      email: ' USER@example.com ',
    });
    expect(fixture.componentInstance.hasChanges()).toBe(false);
    fixture.componentInstance.onSubmit();
    http.expectNone(`${environment.apiUrl}Users/${savedProfile.userId}`);

    fixture.componentInstance.profileForm.setValue({
      userName: ' new-user ',
      email: ' NEW@example.com ',
    });
    fixture.componentInstance.onSubmit();

    const request = http.expectOne(`${environment.apiUrl}Users/${savedProfile.userId}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      userName: 'new-user',
      email: 'new@example.com',
    });
    request.flush({
      ...savedProfile,
      userName: 'new-user',
      email: 'new@example.com',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your profile has been updated.');
    expect(fixture.nativeElement.textContent).toContain('new-user');
  });

  it('validates and saves an email with surrounding whitespace after trimming', () => {
    loadSavedProfile();
    fixture.componentInstance.startEditing();
    fixture.componentInstance.profileForm.setValue({
      userName: savedProfile.userName,
      email: '  padded@example.com  ',
    });

    expect(fixture.componentInstance.profileForm.controls.email.valid).toBe(true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).disabled,
    ).toBe(false);

    fixture.componentInstance.onSubmit();
    const request = http.expectOne(`${environment.apiUrl}Users/${savedProfile.userId}`);
    expect(request.request.body.email).toBe('padded@example.com');
    request.flush({ ...savedProfile, email: 'padded@example.com' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('padded@example.com');
  });
});
