import { TestBed } from '@angular/core/testing';
import { Habits } from '../../../core/services/habits';
import { HabitsList } from './habits-list';

describe('HabitsList sections', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsList],
      providers: [{ provide: Habits, useValue: {} }],
    }).compileComponents();
  });

  it('opens, closes, and switches between sections', () => {
    const fixture = TestBed.createComponent(HabitsList);
    const component = fixture.componentInstance;

    component.toggleSection(1, 'completions');
    expect(component.isExpanded(1, 'completions')).toBe(true);
    expect(component.isExpanded(1, 'reminders')).toBe(false);

    component.toggleSection(1, 'completions');
    expect(component.expandedSection()).toBeNull();

    component.toggleSection(1, 'reminders');
    expect(component.isExpanded(1, 'reminders')).toBe(true);

    component.toggleSection(1, 'reminders');
    expect(component.expandedSection()).toBeNull();

    component.toggleSection(1, 'completions');
    component.toggleSection(1, 'reminders');
    expect(component.isExpanded(1, 'completions')).toBe(false);
    expect(component.isExpanded(1, 'reminders')).toBe(true);

    component.toggleSection(2, 'completions');
    expect(component.isExpanded(1, 'reminders')).toBe(false);
    expect(component.isExpanded(2, 'completions')).toBe(true);

    fixture.destroy();
  });
});
