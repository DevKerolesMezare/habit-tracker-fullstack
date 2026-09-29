import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  imports: [DatePipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('client');
  private http = inject(HttpClient);

  arr = signal<any>([]);

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (res) =>{ 
        this.arr.set(res)
        console.log(this.arr());
      },

      error: (err) => console.log(err),
    });
  }
}
