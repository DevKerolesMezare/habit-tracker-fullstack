
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const HABITS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./habits-list/habits-list').then((m) => m.HabitsList),
    title: 'My Habits',
  },
];
