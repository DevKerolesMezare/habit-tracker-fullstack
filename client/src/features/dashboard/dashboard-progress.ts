import { Dashboard } from '../../shared/models/dashboard';

interface DashboardDay {
  date: string;
  label: string;
  count: number;
  widthPercent: number;
}

export interface DashboardProgress {
  firstDay: string;
  lastDay: string;
  todayCompletedCount: number;
  weekCompletedCount: number;
  days: DashboardDay[];
  habits: (Dashboard['habits'][number] & { completedCount: number })[];
}

export function calculateDashboardProgress(dashboard: Dashboard): DashboardProgress | null {
  const today = parseDateOnly(dashboard.today);
  if (!today) {
    return null;
  }

  const dates = Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
  const firstDay = dates[0];
  const weekStart = addDays(today, -((today.getUTCDay() + 6) % 7));
  const todayKey = dashboard.today;
  const countsByDate = new Map<string, number>();
  const completedByHabit = new Map<number, number>();
  const completedToday = new Set<number>();
  let weekCompletedCount = 0;

  for (const completion of dashboard.completions) {
    const date = parseDateOnly(completion.completionDate);
    if (!date || date < firstDay || date > today) {
      continue;
    }
    if (!isCompleted(completion.statusName)) {
      continue;
    }

    countsByDate.set(
      completion.completionDate,
      (countsByDate.get(completion.completionDate) ?? 0) + 1,
    );
    completedByHabit.set(completion.habitId, (completedByHabit.get(completion.habitId) ?? 0) + 1);
    if (completion.completionDate === todayKey) {
      completedToday.add(completion.habitId);
    }
    if (date >= weekStart) {
      weekCompletedCount++;
    }
  }

  const maximumCount = Math.max(0, ...countsByDate.values());
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const days = dates.map((date) => {
    const dateKey = formatDateOnly(date);
    const count = countsByDate.get(dateKey) ?? 0;
    return {
      date: dateKey,
      label: dateFormatter.format(date),
      count,
      widthPercent: maximumCount === 0 ? 0 : (count / maximumCount) * 100,
    };
  });

  return {
    firstDay: formatDateOnly(firstDay),
    lastDay: todayKey,
    todayCompletedCount: completedToday.size,
    weekCompletedCount,
    days,
    habits: dashboard.habits.map((habit) => ({
      ...habit,
      completedCount: completedByHabit.get(habit.habitId) ?? 0,
    })),
  };
}

function isCompleted(statusName: string): boolean {
  return statusName.trim().toLowerCase() === 'completed';
}

function parseDateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function formatDateOnly(date: Date): string {
  return [
    date.getUTCFullYear().toString().padStart(4, '0'),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getUTCDate().toString().padStart(2, '0'),
  ].join('-');
}
