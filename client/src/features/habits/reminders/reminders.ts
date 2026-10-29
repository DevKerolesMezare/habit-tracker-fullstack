import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Reminders } from '../../../core/services/reminders';
import { getHttpErrorDetails } from '../../../core/utils/http-error';
import { Reminder } from '../../../shared/models/reminder';

@Component({
  selector: 'app-habit-reminders',
  imports: [ReactiveFormsModule],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css',
})
export class HabitReminders {
  habitId = input.required<number>();

  private fb = inject(FormBuilder);
  private remindersService = inject(Reminders);

  reminders = signal<Reminder[]>([]);
  selectedReminder = signal<Reminder | null>(null);
  isFormOpen = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  deletingReminderId = signal<number | null>(null);
  errorMessage = signal('');
  successMessage = signal('');

  reminderForm = this.fb.nonNullable.group({
    reminderTime: ['', Validators.required],
    isActive: [true],
  });

  constructor() {
    effect(() => {
      this.loadReminders(this.habitId());
    });
  }

  loadReminders(habitId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.remindersService.getReminders(habitId).subscribe({
      next: (reminders) => {
        this.reminders.set(reminders);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to load reminders.'));
        this.isLoading.set(false);
      },
    });
  }

  openCreateForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.selectedReminder.set(null);
    this.reminderForm.reset({ reminderTime: '', isActive: true });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isFormOpen.set(true);
  }

  openEditForm(reminder: Reminder): void {
    if (this.isSubmitting()) {
      return;
    }

    this.selectedReminder.set(reminder);
    this.reminderForm.reset({
      reminderTime: reminder.reminderTime.slice(0, 5),
      isActive: reminder.isActive,
    });
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isFormOpen.set(false);
    this.selectedReminder.set(null);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    if (this.reminderForm.invalid || this.isSubmitting()) {
      this.reminderForm.markAllAsTouched();
      return;
    }

    const { reminderTime, isActive } = this.reminderForm.getRawValue();
    const timeForApi = reminderTime.length === 5 ? `${reminderTime}:00` : reminderTime;
    const reminder = this.selectedReminder();

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const onSaved = () => {
      this.isSubmitting.set(false);
      this.closeForm();
      this.successMessage.set(reminder ? 'Reminder updated.' : 'Reminder created.');
      this.loadReminders(this.habitId());
    };
    const onError = (error: HttpErrorResponse) => {
      this.isSubmitting.set(false);
      this.errorMessage.set(this.getErrorMessage(error, 'Failed to save reminder.'));
    };

    if (reminder) {
      this.remindersService
        .updateReminder(this.habitId(), reminder.reminderId, {
          reminderTime: timeForApi,
          isActive,
        })
        .subscribe({ next: onSaved, error: onError });
    } else {
      this.remindersService
        .createReminder(this.habitId(), { reminderTime: timeForApi })
        .subscribe({ next: onSaved, error: onError });
    }
  }

  deleteReminder(reminder: Reminder): void {
    if (this.deletingReminderId() !== null) {
      return;
    }

    if (!confirm('Are you sure you want to delete this reminder?')) {
      return;
    }

    this.deletingReminderId.set(reminder.reminderId);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.remindersService.deleteReminder(this.habitId(), reminder.reminderId).subscribe({
      next: () => {
        this.deletingReminderId.set(null);
        this.successMessage.set('Reminder deleted.');
        this.loadReminders(this.habitId());
      },
      error: (error: HttpErrorResponse) => {
        this.deletingReminderId.set(null);
        this.errorMessage.set(this.getErrorMessage(error, 'Failed to delete reminder.'));
      },
    });
  }

  formatTime(reminderTime: string): string {
    return reminderTime.slice(0, 5);
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    const details = getHttpErrorDetails(error);
    return (
      details.message ??
      details.detail ??
      details.validationErrors ??
      details.title ??
      fallback
    );
  }
}