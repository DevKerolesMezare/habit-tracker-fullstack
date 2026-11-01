import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';

import { environment } from '../../environments/environment.development';
import {
  AuthResponse,
  Login,
  Register,
  UserInfo,
} from '../../shared/models/user';

@Service()
export class Auth {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private sessionVersion = 0;

  currentUser = signal<UserInfo | null>(null);

  login(login: Login) {
    const sessionVersion = this.sessionVersion;
    return this.http.post<AuthResponse>(this.baseUrl + 'Auth/login', login).pipe(
      tap((response) => {
        if (sessionVersion === this.sessionVersion) {
          this.startSession(response.token);
        }
      }),
    );
  }

  register(register: Register) {
    const sessionVersion = this.sessionVersion;
    return this.http.post<AuthResponse>(this.baseUrl + 'Auth/register', register).pipe(
      tap((response) => {
        if (sessionVersion === this.sessionVersion) {
          this.startSession(response.token);
        }
      }),
    );
  }

  getUserInfo() {
    const sessionVersion = this.sessionVersion;
    return this.http.get<UserInfo>(this.baseUrl + 'Auth/user-info').pipe(
      tap((user) => {
        this.setCurrentUser(sessionVersion, user);
      }),
      catchError((error: unknown) => {
        if (sessionVersion === this.sessionVersion) {
          this.logout();
        }
        return throwError(() => error);
      }),
    );
  }

  getSessionVersion() {
    return this.sessionVersion;
  }

  syncCurrentUserForToken(user: UserInfo, token: string | null, sessionVersion: number) {
    if (
      sessionVersion === this.sessionVersion &&
      token &&
      token === localStorage.getItem('token')
    ) {
      this.setCurrentUser(this.sessionVersion, user);
    }
  }

  restoreSession() {
    const token = localStorage.getItem('token');

    if (!token) {
      return of(null);
    }

    return this.getUserInfo().pipe(
      catchError(() => of(null)),
    );
  }

  logout() {
    this.sessionVersion++;
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  private startSession(token: string) {
    this.sessionVersion++;
    localStorage.setItem('token', token);
    this.currentUser.set(null);
  }

  private setCurrentUser(sessionVersion: number, user: UserInfo) {
    if (sessionVersion === this.sessionVersion) {
      this.currentUser.set(user);
    }
  }
}
