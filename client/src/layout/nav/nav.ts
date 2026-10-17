import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private authService = inject(Auth);

  currentUser = this.authService.currentUser;
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }
}
