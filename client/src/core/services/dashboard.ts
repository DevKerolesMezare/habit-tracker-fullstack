import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Dashboard } from '../../shared/models/dashboard';

@Service()
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}Dashboard`;

  getDashboard() {
    return this.http.get<Dashboard>(this.baseUrl);
  }
}
