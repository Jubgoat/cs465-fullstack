import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { BROWSER_STORAGE } from '../storage';
import { TripDataService } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly tokenKey = 'travlr-token';

  constructor(
    private tripDataService: TripDataService,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  login(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.login(user, password).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.tripDataService.register(user, password).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  getToken(): string {
    return this.storage.getItem(this.tokenKey) ?? '';
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const payloadPart = token.split('.')[1];

    if (!payloadPart) return false;

    try {
      const base64 = payloadPart
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(payloadPart.length / 4) * 4, '=');
      const payload = JSON.parse(atob(base64)) as { exp?: number };

      return typeof payload.exp === 'number' &&
        payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  private saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }
}