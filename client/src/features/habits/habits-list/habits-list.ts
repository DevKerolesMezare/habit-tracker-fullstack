import { Component, inject, signal, OnInit } from '@angular/core';
import { Habit } from '../../../shared/models/habit';
import { FrequencyType } from '../../../shared/models/frequency-type';
import { HabitForm } from '../habit-form/habit-form';
import { HabitCompletionsComponent } from '../habit-completions/habit-completions';
import { Habits } from '../../../core/services/habits';
import { HabitReminders } from '../reminders/reminders';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-habits-list',
  imports: [HabitForm, HabitCompletionsComponent, HabitReminders],
  templateUrl: './habits-list.html',
  styleUrl: './habits-list.css',
})
export class HabitsList implements OnInit {
  private habitsService = inject(Habits);
  private route = inject(ActivatedRoute);

  habits = signal<Habit[]>([]);
  frequencyTypes = signal<FrequencyType[]>([]);
  frequencyTypesError = signal('');
  isLoading = signal(true);
  errorMessage = signal('');
  isFormOpen = signal(false);
  selectedHabit = signal<Habit | null>(null);
  expandedSection = signal<{
    habitId: number;
    section: 'completions' | 'reminders';
  } | null>(null);

  ngOnInit(): void {
    this.loadFrequencyTypes();
    this.loadHabits();
  }

  loadFrequencyTypes(): void {
    this.frequencyTypesError.set('');
    this.habitsService.getFrequencyTypes().subscribe({
      next: (types) => this.frequencyTypes.set(types),
      error: () => this.frequencyTypesError.set('Failed to load frequency types.'),
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
        const habitId = Number(this.route.snapshot.queryParamMap.get('habitId'));
        if (Number.isSafeInteger(habitId) && habits.some((habit) => habit.habitId === habitId)) {
          this.expandedSection.set({ habitId, section: 'completions' });
        }
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

  isExpanded(habitId: number, section: 'completions' | 'reminders'): boolean {
    const expandedSection = this.expandedSection();
    return expandedSection?.habitId === habitId && expandedSection.section === section;
  }

  toggleSection(habitId: number, section: 'completions' | 'reminders'): void {
    this.expandedSection.update((currentSection) =>
      currentSection?.habitId === habitId && currentSection.section === section
        ? null
        : { habitId, section },
    );
  }

  archiveHabit(id: number): void {
    if (!confirm('Are you sure you want to archive this habit?')) {
      return;
    }

    this.habitsService.archiveHabit(id).subscribe({
      next: () => {
        if (this.expandedSection()?.habitId === id) {
          this.expandedSection.set(null);
        }

        this.loadHabits();
      },
      error: () => {
        this.errorMessage.set('Failed to archive habit. Please try again.');
      },
    });
  }
}
