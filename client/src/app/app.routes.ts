import { Routes } from '@angular/router';

import { Login } from '../features/account/login/login';
import { Register } from '../features/account/register/register';
import { Home } from '../features/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'register', component: Register, title: 'Register' },
  { path: '**', redirectTo: '' },
];
