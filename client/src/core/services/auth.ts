import { inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, Login, Register, UserInfo } from '../../shared/models/user';
import { tap } from 'rxjs';

@Service()
export class Auth {
  value(value: any) {
    throw new Error('Method not implemented.');
  }
  baseUrl = environment.apiUrl;
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

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }
}
