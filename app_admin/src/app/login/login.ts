import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  credentials = {
    email: '',
    password: ''
  };

  formError = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  onLoginSubmit(): void {
    this.formError = '';

    const user = new User();
    user.email = this.credentials.email.trim();

    this.authenticationService.login(user, this.credentials.password).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => {
        this.formError = 'Login failed. Check your email and password, then try again.';
      }
    });
  }
}