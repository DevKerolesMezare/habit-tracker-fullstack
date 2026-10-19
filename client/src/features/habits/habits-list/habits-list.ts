import { Component, inject, signal, OnInit } from '@angular/core';
import { Habit } from '../../../shared/models/habit';
import { FrequencyType } from '../../../shared/models/frequency-type';
import { HabitForm } from '../habit-form/habit-form';
import { HabitCompletionsComponent } from '../habit-completions/habit-completions';
import { Habits } from '../../../core/services/habits';

@Component({
  selector: 'app-habits-list',
  imports: [HabitForm, HabitCompletionsComponent],
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
  expandedHabitId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadFrequencyTypes();
    this.loadHabits();
  }

  loadFrequencyTypes(): void {
    this.habitsService.getFrequencyTypes().subscribe({
      next: (types) => this.frequencyTypes.set(types),
    });
  }

  getFrequencyName(id: number): string {
    return (
      this.frequencyTypes().find((type) => type.frequencyTypeId === id)?.frequencyName ?? 'Unknown'
    );
  }

  loadHabits(): void {
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

  openCreateForm(): void {
    this.selectedHabit.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(habit: Habit): void {
    this.selectedHabit.set(habit);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.selectedHabit.set(null);
  }

  onHabitSaved(): void {
    this.closeForm();
    this.loadHabits();
  }

  toggleCompletions(habitId: number): void {
    this.expandedHabitId.update((currentId) => (currentId === habitId ? null : habitId));
  }

  archiveHabit(id: number): void {
    if (!confirm('Are you sure you want to archive this habit?')) {
      return;
    }

    this.habitsService.archiveHabit(id).subscribe({
      next: () => {
        if (this.expandedHabitId() === id) {
          this.expandedHabitId.set(null);
        }

        this.loadHabits();
      },
      error: () => {
        this.errorMessage.set('Failed to archive habit. Please try again.');
      },
    });
  }
}
