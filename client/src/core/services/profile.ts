import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { UserInfo } from '../../shared/models/user';
import { Auth } from './auth';

export type UserProfile = UserInfo & {
  createdAt: string;
  isActive: boolean;
};

export type UpdateProfile = {
  userName: string;
  email: string;
};

export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
};

@Service()
export class ProfileService {
  private baseUrl = environment.apiUrl + 'Users';
  private http = inject(HttpClient);
  private auth = inject(Auth);

  getProfile() {
    const token = localStorage.getItem('token');
    const sessionVersion = this.auth.getSessionVersion();

    return this.http.get<UserProfile>(`${this.baseUrl}/me`).pipe(
      tap((profile) => this.syncCurrentUser(profile, token, sessionVersion)),
    );
  }

  updateProfile(userId: number, profile: UpdateProfile) {
    const token = localStorage.getItem('token');
    const sessionVersion = this.auth.getSessionVersion();

    return this.http.put<UserProfile>(`${this.baseUrl}/${userId}`, profile).pipe(
      tap((updatedProfile) => this.syncCurrentUser(updatedProfile, token, sessionVersion)),
    );
  }

  changePassword(password: ChangePassword) {
    return this.http.put<void>(`${this.baseUrl}/me/password`, password);
  }

  private syncCurrentUser(profile: UserInfo, token: string | null, sessionVersion: number) {
    this.auth.syncCurrentUserForToken(
      {
        userId: profile.userId,
        userName: profile.userName,
        email: profile.email,
      },
      token,
      sessionVersion,
    );
  }
}
