import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  menuOpen = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isMenuOpen() {
    return this.menuOpen;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.menuOpen = false;
  }
}