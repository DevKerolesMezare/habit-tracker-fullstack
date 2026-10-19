import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { Habit, CreateHabit, UpdateHabit } from '../../shared/models/habit';
import { FrequencyType } from '../../shared/models/frequency-type';
import { Status } from '../../shared/models/status';

@Service()
export class Habits {
  private baseUrl = environment.apiUrl + 'Habits';
  private lookupsUrl = environment.apiUrl + 'Lookups';
  private http = inject(HttpClient);

  // Habit operations
  getHabits() {
    return this.http.get<Habit[]>(this.baseUrl);
  }

  getHabit(id: number) {
    return this.http.get<Habit>(`${this.baseUrl}/${id}`);
  }

  createHabit(habit: CreateHabit) {
    return this.http.post<Habit>(this.baseUrl, habit);
  }

  updateHabit(id: number, habit: UpdateHabit) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, habit);
  }

  archiveHabit(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Lookup data
  getFrequencyTypes() {
    return this.http.get<FrequencyType[]>(`${this.lookupsUrl}/frequency-types`);
  }

  getStatuses() {
    return this.http.get<Status[]>(`${this.lookupsUrl}/statuses`);
  }
}
