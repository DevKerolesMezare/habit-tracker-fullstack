import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import {
  HabitCompletion,
  CreateHabitCompletion,
  UpdateHabitCompletion,
} from '../../shared/models/habit-completion';

@Service()
export class HabitCompletions {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}habits`;

  getCompletions(habitId: number) {
    return this.http.get<HabitCompletion[]>(`${this.baseUrl}/${habitId}/completions`);
  }

  getCompletion(habitId: number, completionId: number) {
    return this.http.get<HabitCompletion>(`${this.baseUrl}/${habitId}/completions/${completionId}`);
  }

  createCompletion(habitId: number, data: CreateHabitCompletion) {
    return this.http.post<HabitCompletion>(`${this.baseUrl}/${habitId}/completions`, data);
  }

  updateCompletion(habitId: number, completionId: number, data: UpdateHabitCompletion) {
    return this.http.put<void>(`${this.baseUrl}/${habitId}/completions/${completionId}`, data);
  }

  deleteCompletion(habitId: number, completionId: number) {
    return this.http.delete<void>(`${this.baseUrl}/${habitId}/completions/${completionId}`);
  }
}
