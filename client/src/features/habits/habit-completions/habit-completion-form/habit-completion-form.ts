import { Component, effect, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { getHttpErrorDetails } from '../../../../core/utils/http-error';
import { HabitCompletion } from '../../../../shared/models/habit-completion';
import { Status } from '../../../../shared/models/status';
import { HabitCompletions } from '../../../../core/services/habit-completions';
import { Habits } from '../../../../core/services/habits';

@Component({
  selector: 'app-habit-completion-form',
  imports: [ReactiveFormsModule],
  templateUrl: './habit-completion-form.html',
  styleUrl: './habit-completion-form.css',
})
export class HabitCompletionForm {
  private fb = inject(FormBuilder);
  private completionsService = inject(HabitCompletions);
  private habitsService = inject(Habits);

  habitId = input.required<number>();
  completion = input<HabitCompletion | null>(null);

  saved = output<void>();
  cancelled = output<void>();

  statuses = signal<Status[]>([]);
  isLoadingStatuses = signal(true);
  statusLoadError = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');

  private readonly notFutureDateValidator: ValidatorFn = (control) => {
    const value: unknown = control.value;
    if (typeof value !== 'string' || value.length === 0) {
      return null;
    }

    return value > this.today ? { futureDate: true } : null;
  };

  completionForm = this.fb.group({
    completionDate: ['', [Validators.required, this.notFutureDateValidator]],
    statusId: [null as number | null, [Validators.required, Validators.min(1)]],
    notes: ['', Validators.maxLength(350)],
  });

  get today(): string {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  constructor() {
    this.loadStatuses();

    effect(() => {
      const completion = this.completion();

      this.completionForm.reset({
        completionDate: completion?.completionDate ?? '',
        statusId: completion?.statusId ?? null,
        notes: completion?.notes ?? '',
      });
    });
  }

  loadStatuses(): void {
    this.isLoadingStatuses.set(true);
    this.statusLoadError.set('');
    this.habitsService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses.set(statuses);
        this.isLoadingStatuses.set(false);
        if (statuses.length === 0) {
          this.statusLoadError.set('No completion statuses are available. Please try again later.');
        }
      },
      error: () => {
        this.isLoadingStatuses.set(false);
        this.statusLoadError.set('Failed to load statuses. Please try again.');
      },
    });
  }

  onSubmit(): void {
    if (this.completionForm.invalid || this.isSubmitting() || this.isLoadingStatuses()) {
      this.completionForm.markAllAsTouched();
      return;
    }

    const value = this.completionForm.getRawValue();

    if (value.statusId === null) return;

    const data = {
      completionDate: value.completionDate!,
      statusId: value.statusId,
      notes: value.notes?.trim() || null,
    };

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const completion = this.completion();

    const handleError = (error: HttpErrorResponse) => {
      this.isSubmitting.set(false);
      this.errorMessage.set(this.getErrorMessage(error));
    };

    if (completion) {
      this.completionsService
        .updateCompletion(this.habitId(), completion.completionId, data)
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.saved.emit();
          },
          error: handleError,
        });
    } else {
      this.completionsService.createCompletion(this.habitId(), data).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.saved.emit();
        },
        error: handleError,
      });
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const details = getHttpErrorDetails(error);
    return (
      details.message ??
      details.detail ??
      details.title ??
      details.validationErrors ??
      'Failed to save completion. Please try again.'
    );
  }
}
