import { Dashboard } from '../../shared/models/dashboard';
import { calculateDashboardProgress } from './dashboard-progress';

describe('calculateDashboardProgress', () => {
  it('counts only Completed records and groups the last seven date-only days', () => {
    const dashboard: Dashboard = {
      today: '2026-10-24',
      habits: [
        { habitId: 1, habitName: 'Read', frequencyName: 'Daily' },
        { habitId: 2, habitName: 'Walk', frequencyName: 'Weekly' },
      ],
      completions: [
        { completionId: 8, habitId: 1, completionDate: '2026-10-17', statusName: 'Completed' },
        { completionId: 1, habitId: 1, completionDate: '2026-10-19', statusName: 'Completed' },
        {
          completionId: 2,
          habitId: 1,
          completionDate: '2026-10-20',
          statusName: 'Partially Completed',
        },
        { completionId: 3, habitId: 2, completionDate: '2026-10-21', statusName: 'Missed' },
        { completionId: 7, habitId: 1, completionDate: '2026-10-24', statusName: 'Completed' },
        { completionId: 4, habitId: 2, completionDate: '2026-10-24', statusName: 'completed' },
        { completionId: 5, habitId: 1, completionDate: 'invalid', statusName: 'Completed' },
        { completionId: 6, habitId: 1, completionDate: '2026-10-25', statusName: 'Completed' },
      ],
    };

    const progress = calculateDashboardProgress(dashboard);

    if (!progress) {
      throw new Error('Expected a valid dashboard date.');
    }

    expect(progress.firstDay).toBe('2026-10-18');
    expect(progress.todayCompletedCount).toBe(2);
    expect(progress.weekCompletedCount).toBe(3);
    expect(progress.days).toHaveLength(7);
    expect(progress.days.map((day) => day.count)).toEqual([0, 1, 0, 0, 0, 0, 2]);
    expect(progress.habits.map((habit) => habit.completedCount)).toEqual([2, 1]);
  });

  it('counts a Sunday as the end of the Monday-starting week', () => {
    const dashboard: Dashboard = {
      today: '2026-10-25',
      habits: [{ habitId: 1, habitName: 'Read', frequencyName: 'Daily' }],
      completions: [
        { completionId: 1, habitId: 1, completionDate: '2026-10-19', statusName: 'Completed' },
        { completionId: 2, habitId: 1, completionDate: '2026-10-25', statusName: 'Completed' },
      ],
    };

    const progress = calculateDashboardProgress(dashboard);

    if (!progress) {
      throw new Error('Expected a valid dashboard date.');
    }

    expect(progress.firstDay).toBe('2026-10-19');
    expect(progress.weekCompletedCount).toBe(2);
    expect(progress.todayCompletedCount).toBe(1);
    expect(progress.days.map((day) => day.count)).toEqual([1, 0, 0, 0, 0, 0, 1]);
  });

  it('returns zero counts and seven zero-activity days for empty activity', () => {
    const dashboard: Dashboard = {
      today: '2026-10-24',
      habits: [{ habitId: 1, habitName: 'Read', frequencyName: 'Daily' }],
      completions: [],
    };

    const progress = calculateDashboardProgress(dashboard);

    if (!progress) {
      throw new Error('Expected a valid dashboard date.');
    }

    expect(progress.todayCompletedCount).toBe(0);
    expect(progress.weekCompletedCount).toBe(0);
    expect(progress.days.map((day) => day.count)).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(progress.habits[0].completedCount).toBe(0);
  });

  it('rejects an invalid dashboard date without throwing', () => {
    const dashboard: Dashboard = {
      today: '2026-02-30',
      habits: [],
      completions: [],
    };

    expect(calculateDashboardProgress(dashboard)).toBeNull();
  });
});
