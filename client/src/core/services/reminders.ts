
import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import {
  CreateReminder,
  Reminder,
  UpdateReminder,
} from '../../shared/models/reminder';

@Service()
export class Reminders {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}habits`;

  getReminders(habitId: number) {
    return this.http.get<Reminder[]>(`${this.baseUrl}/${habitId}/reminders`);
  }

  getReminder(habitId: number, reminderId: number) {
    return this.http.get<Reminder>(
      `${this.baseUrl}/${habitId}/reminders/${reminderId}`
    );
  }

  createReminder(habitId: number, data: CreateReminder) {
    return this.http.post<Reminder>(`${this.baseUrl}/${habitId}/reminders`, data);
  }

  updateReminder(habitId: number, reminderId: number, data: UpdateReminder) {
    return this.http.put<void>(`${this.baseUrl}/${habitId}/reminders/${reminderId}`, data);
  }

  deleteReminder(habitId: number, reminderId: number) {
    return this.http.delete<void>(
      `${this.baseUrl}/${habitId}/reminders/${reminderId}`
    );
  }
}
