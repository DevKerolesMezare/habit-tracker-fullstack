import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { authGuard } from '../../core/guards/auth.guard';
import { Nav } from './nav';

@Component({ template: '' })
class TestPage {}

describe('Nav logout', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', component: TestPage },
          { path: 'profile', canActivate: [authGuard], component: TestPage },
        ]),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('clears auth state, navigates to login, and guards later protected navigation', async () => {
    const auth = TestBed.inject(Auth);
    const router = TestBed.inject(Router);
    auth.currentUser.set({
      userId: 7,
      userName: 'habit-user',
      email: 'user@example.com',
    });
    localStorage.setItem('token', 'test-token');

    const fixture = TestBed.createComponent(Nav);
    await router.navigateByUrl('/profile');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Logout');

    await fixture.componentInstance.logout();
    fixture.detectChanges();

    expect(router.url).toBe('/login');
    expect(auth.currentUser()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Login');
    expect(fixture.nativeElement.textContent).toContain('Register');
    expect(fixture.nativeElement.textContent).not.toContain('Logout');

    await router.navigateByUrl('/profile');
    expect(router.url).toBe('/login');
  });
