import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    // AGM 15/02/2024 - Código del login refactorizado
    private baseUrl: string = 'http://localhost:5000/auth';

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });

        return this.http.post(`${this.baseUrl}/maestro/login`, formData.toString(), { headers, withCredentials: true });
    }

    logout(): Observable<any> {
        return this.http.get(`${this.baseUrl}/logout`, { withCredentials: true });
    }
}
