import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  user = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.authService.login(this.user).subscribe({
      next: (response: any) => {
        console.log(response);

        // JWT token is automatically saved by AuthService (tap operator)
        // But we can also save user information if needed
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log(error);
        alert(error.error?.message || 'Login Failed');
      }
    });
  }
}