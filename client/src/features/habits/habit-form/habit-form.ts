import { Component, inject, signal, OnInit, input, output, effect } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit, CreateHabit, UpdateHabit } from '../../../shared/models/habit';
import { FrequencyType } from '../../../shared/models/frequency-type';
import { Habits } from '../../../core/services/habits';

@Component({
  selector: 'app-habit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './habit-form.html',
  styleUrl: './habit-form.css',
})
export class HabitForm implements OnInit {
  private fb = inject(FormBuilder);
  private habitsService = inject(Habits);

  habit = input<Habit | null>(null);
  saved = output<void>();

  frequencyTypes = signal<FrequencyType[]>([]);
  isLoadingFrequencyTypes = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal('');

  habitForm = this.fb.group({
    habitName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(150)]],
    description: ['', Validators.maxLength(350)],
    frequencyTypeId: [null as number | null, Validators.required],
  });

  constructor() {
    effect(() => {
      const habit = this.habit();

      if (habit) {
        this.habitForm.patchValue({
          habitName: habit.habitName,
          description: habit.description ?? '',
          frequencyTypeId: habit.frequencyTypeId,
        });
      } else {
        this.habitForm.reset({
          habitName: '',
          description: '',
          frequencyTypeId: null,
        });
      }
    });
  }
  
  hasChanges(): boolean {
    const habit = this.habit();

    if (!habit) {
      return true;
    }

    const current = this.habitForm.getRawValue();

    return (
      current.habitName !== habit.habitName ||
      (current.description ?? '') !== (habit.description ?? '') ||
      current.frequencyTypeId !== habit.frequencyTypeId
    );
  }


  ngOnInit() {
    this.loadFrequencyTypes();
  }

  loadFrequencyTypes(): void {
    this.isLoadingFrequencyTypes.set(true);
    this.errorMessage.set('');
    this.habitsService.getFrequencyTypes().subscribe({
      next: (types) => {
        this.frequencyTypes.set(types);
        this.isLoadingFrequencyTypes.set(false);
        if (types.length === 0) {
          this.errorMessage.set('No frequency options are available. Please try again later.');
        }
      },
      error: () => {
        this.isLoadingFrequencyTypes.set(false);
        this.errorMessage.set('Failed to load frequency types. Please try again.');
      },
    });
  }

  onSubmit() {
    if (this.habitForm.invalid || this.isSubmitting() || this.isLoadingFrequencyTypes()) {
      this.habitForm.markAllAsTouched();
      return;
    }

    const value = this.habitForm.getRawValue();

    if (value.frequencyTypeId === null) {
      return;
    }

    const data: CreateHabit = {
      habitName: value.habitName!.trim(),
      description: value.description?.trim() || null,
      frequencyTypeId: value.frequencyTypeId,
    };

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const habit = this.habit();

    const handleSuccess = () => {
      this.isSubmitting.set(false);
      this.saved.emit();
    };

    const handleError = (error: HttpErrorResponse) => {
      this.isSubmitting.set(false);
      this.errorMessage.set(
        typeof error.error === 'string' && error.error.trim()
          ? error.error
          : 'Failed to save habit. Please try again.',
      );
    };

    if (habit) {
      const updateData: UpdateHabit = data;
      this.habitsService.updateHabit(habit.habitId, updateData).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    } else {
      this.habitsService.createHabit(data).subscribe({
        next: handleSuccess,
        error: handleError,
      });
    }
  }
}
