export interface Habit {
  habitId: number;
  habitName: string;
  description: string | null;
  frequencyTypeId: number;
  isArchived: boolean | null;
  archivedAt: string | null;
}

export interface CreateHabit {
  habitName: string;
  description: string | null;
  frequencyTypeId: number;
}

export interface UpdateHabit {
  habitName: string;
  description: string | null;
  frequencyTypeId: number;
}
