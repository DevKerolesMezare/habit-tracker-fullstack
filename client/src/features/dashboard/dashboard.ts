import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard';
import { calculateDashboardProgress, DashboardProgress } from './dashboard-progress';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);

  progress = signal<DashboardProgress | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.progress.set(null);

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        const progress = calculateDashboardProgress(data);
        if (!progress) {
          this.errorMessage.set('The dashboard returned an invalid date. Please try again.');
          this.isLoading.set(false);
          return;
        }

        this.progress.set(progress);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load your dashboard. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  formatDate(date: string, includeYear = true): string {
    const [year, month, day] = date.split('-').map(Number);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    };

    if (includeYear) {
      options.year = 'numeric';
    }

    return new Intl.DateTimeFormat(undefined, options).format(
      new Date(Date.UTC(year, month - 1, day)),
    );
  }
}
