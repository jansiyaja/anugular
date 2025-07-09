import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ApiService} from '../../core/services/api';  
@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule] // ✅ required for *ngIf and [(ngModel)]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    this.api.login({ email: this.email, password: this.password }).subscribe((res: any) => {
      if (res.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = res.message || 'Invalid credentials.';
      }
    }, () => {
      this.error = 'Server error. Please try again later.';
    });
  }
}