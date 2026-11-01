import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment.development';
import { Auth } from './auth';
import { ProfileService } from './profile';

describe('ProfileService', () => {
  let service: ProfileService;
  let auth: Auth;
  let http: HttpTestingController;

  const profile = {
    userId: 7,
    userName: 'habit-user',
    email: 'user@example.com',
    createdAt: '2026-01-15T00:00:00',
    isActive: true,
  };

  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProfileService);
    auth = TestBed.inject(Auth);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('token');
  });

  it('loads the current profile and synchronizes only UserInfo fields', () => {
    let response: typeof profile | undefined;
    service.getProfile().subscribe((value) => (response = value));

    const request = http.expectOne(`${environment.apiUrl}Users/me`);
    expect(request.request.method).toBe('GET');
    request.flush(profile);

    expect(response).toEqual(profile);
    expect(auth.currentUser()).toEqual({
      userId: profile.userId,
      userName: profile.userName,
      email: profile.email,
    });
  });

  it('updates profile information and synchronizes the updated user', () => {
    const changes = { userName: 'new-user', email: 'new@example.com' };
    service.updateProfile(profile.userId, changes).subscribe();

    const request = http.expectOne(`${environment.apiUrl}Users/${profile.userId}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(changes);
    request.flush({ ...profile, ...changes });

    expect(auth.currentUser()).toEqual({
      userId: profile.userId,
      ...changes,
    });
  });

  it('does not restore current user when a request completes after logout', () => {
    service.getProfile().subscribe();
    const request = http.expectOne(`${environment.apiUrl}Users/me`);

    auth.logout();
    localStorage.setItem('token', 'test-token');
    request.flush(profile);

    expect(auth.currentUser()).toBeNull();
  });
});
