
import { Component, inject, signal, OnInit } from '@angular/core';
import { Habit } from '../../../shared/models/habit';
import { FrequencyType } from '../../../shared/models/frequency-type';
import { HabitForm } from '../habit-form/habit-form';
import { Habits } from '../../../core/services/habits';

@Component({
  selector: 'app-habits-list',
  imports: [HabitForm],
  templateUrl: './habits-list.html',
  styleUrl: './habits-list.css',
})
export class HabitsList implements OnInit {
  private habitsService = inject(Habits);

  habits = signal<Habit[]>([]);
  frequencyTypes = signal<FrequencyType[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  isFormOpen = signal(false);
  selectedHabit = signal<Habit | null>(null);

  ngOnInit() {
    this.loadFrequencyTypes();
    this.loadHabits();
  }

  loadFrequencyTypes() {
    this.habitsService.getFrequencyTypes().subscribe({
      next: (types) => this.frequencyTypes.set(types),
    });
  }

  getFrequencyName(id: number): string {
    return (
      this.frequencyTypes().find(
        (type) => type.frequencyTypeId === id,
      )?.frequencyName ?? 'Unknown'
    );
  }

  loadHabits() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.habitsService.getHabits().subscribe({
      next: (habits) => {
        this.habits.set(habits);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load habits. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  openCreateForm() {
    this.selectedHabit.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(habit: Habit) {
    this.selectedHabit.set(habit);
    this.isFormOpen.set(true);
  }

  closeForm() {
    this.isFormOpen.set(false);
    this.selectedHabit.set(null);
  }

  onHabitSaved() {
    this.closeForm();
    this.loadHabits();
  }

  archiveHabit(id: number) {
    if (!confirm('Are you sure you want to archive this habit?')) {
      return;
    }

    this.habitsService.archiveHabit(id).subscribe({
      next: () => this.loadHabits(),
      error: () => {
        this.errorMessage.set('Failed to archive habit. Please try again.');
      },
    });
  }
}
