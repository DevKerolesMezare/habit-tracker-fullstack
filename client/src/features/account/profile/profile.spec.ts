import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment.development';
import { Profile } from './profile';

describe('Profile', () => {
  let fixture: ComponentFixture<Profile>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.setItem('token', 'test-token');
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('token');
  });

  it('coordinates the profile information and change password sections', () => {
    const request = http.expectOne(`${environment.apiUrl}Users/me`);
    request.flush({
      userId: 7,
      userName: 'habit-user',
      email: 'user@example.com',
      createdAt: '2026-01-15T00:00:00',
      isActive: true,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-profile-information')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-change-password')).toBeTruthy();
  });
});
