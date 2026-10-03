import { Routes } from '@angular/router';
import { Login } from '../features/account/login/login';
import { Register } from '../features/account/register/register';
import { Home } from '../features/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
