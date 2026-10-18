import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { AuthResponse, Login, Register, UserInfo } from '../../shared/models/user';

@Service()
export class Auth {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  currentUser = signal<UserInfo | null>(null);

  login(login: Login) {
    return this.http.post<AuthResponse>(this.baseUrl + 'Auth/login', login).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  register(register: Register) {
    return this.http.post<AuthResponse>(this.baseUrl + 'Auth/register', register).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      }),
    );
  }

  getUserInfo() {
    return this.http.get<UserInfo>(this.baseUrl + 'Auth/user-info').pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
    );
  }

  restoreSession() {
    const token = localStorage.getItem('token');

    if (!token) {
      return of(null);
    }

    return this.getUserInfo().pipe(
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
