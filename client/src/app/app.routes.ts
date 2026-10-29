import { Routes } from '@angular/router';

import { Login } from '../features/account/login/login';
import { Register } from '../features/account/register/register';
import { Home } from '../features/home/home';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'register', component: Register, title: 'Register' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('../features/dashboard/dashboard').then((m) => m.DashboardPage),
    title: 'Dashboard',
  },
  {
    path: 'habits',
    loadChildren: () => import('../features/habits/habits.routes').then((m) => m.HABITS_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
