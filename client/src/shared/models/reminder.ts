export interface Reminder {
  reminderId: number;
  habitId: number;
  reminderTime: string;
  isActive: boolean;
}

export interface CreateReminder {
  reminderTime: string;
}

export interface UpdateReminder {
  reminderTime: string;
  isActive: boolean;
}
