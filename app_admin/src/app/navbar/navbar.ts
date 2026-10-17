import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html'
})
export class Navbar {
  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/');
  }
}