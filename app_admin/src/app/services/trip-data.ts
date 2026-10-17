import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private baseUrl = 'http://localhost:3000/api';
  private tripsUrl = `${this.baseUrl}/trips`;

  constructor(private http: HttpClient) { }

  getTrips(): Observable<Trip[]> {
  return this.http.get<Trip[]>(this.tripsUrl);
}

addTrip(formData: Trip): Observable<Trip> {
  return this.http.post<Trip>(this.tripsUrl, formData);
}

getTrip(tripCode: string): Observable<Trip[]> {
  return this.http.get<Trip[]>(`${this.tripsUrl}/${tripCode}`);
}

updateTrip(formData: Trip): Observable<Trip> {
  return this.http.put<Trip>(`${this.tripsUrl}/${formData.code}`, formData);
}
login(user: User, password: string): Observable<AuthResponse> {
  return this.handleAuthApiCall('login', user, password);
}

register(user: User, password: string): Observable<AuthResponse> {
  return this.handleAuthApiCall('register', user, password);
}

private handleAuthApiCall(
  endpoint: string,
  user: User,
  password: string
): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, {
    name: user.name,
    email: user.email,
    password
  });
}
}