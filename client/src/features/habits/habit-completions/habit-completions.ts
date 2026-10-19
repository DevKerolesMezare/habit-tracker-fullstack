import { Component, effect, inject, input, signal } from '@angular/core';
import { HabitCompletion } from '../../../shared/models/habit-completion';
import { HabitCompletions } from '../../../core/services/habit-completions';
import { HabitCompletionForm } from './habit-completion-form/habit-completion-form';

@Component({
  selector: 'app-habit-completions',
  imports: [HabitCompletionForm],
  templateUrl: './habit-completions.html',
  styleUrl: './habit-completions.css',
})
export class HabitCompletionsComponent {
  habitId = input.required<number>();

  private completionsService = inject(HabitCompletions);

  completions = signal<HabitCompletion[]>([]);
  selectedCompletion = signal<HabitCompletion | null>(null);
  isFormOpen = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor() {
    effect(() => {
      this.loadCompletions(this.habitId());
    });
  }

  private loadCompletions(habitId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.completionsService.getCompletions(habitId).subscribe({
      next: (data) => {
        this.completions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load habit completions.');
        this.isLoading.set(false);
      },
    });
  }

  openCreateForm(): void {
    this.selectedCompletion.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(completion: HabitCompletion): void {
    this.selectedCompletion.set(completion);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.selectedCompletion.set(null);
  }

  onSaved(): void {
    this.closeForm();
    this.loadCompletions(this.habitId());
  }

  deleteCompletion(completion: HabitCompletion): void {
    if (!confirm('Are you sure you want to delete this completion?')) {
      return;
    }

    this.completionsService.deleteCompletion(this.habitId(), completion.completionId).subscribe({
      next: () => this.loadCompletions(this.habitId()),
      error: () => this.errorMessage.set('Failed to delete completion.'),
    });
  }
}
