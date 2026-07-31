import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  user = {
    name: '',
    email: '',
    password: ''
  };

  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {

    if (this.user.password !== this.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    this.authService.register(this.user).subscribe({

      next: (response: any) => {
        console.log(response);

        alert('Registration Successful');

        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.log(error);

        alert(error.error?.message || 'Registration Failed');
      }

    });

  }

}