import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    // AGM 15/02/2024 - Código del login refactorizado
    private baseUrl: string = 'https://knownhome.xyz/auth';
    // 192.168.1.69:5000
    // https://knownhome.xyz

    constructor(private http: HttpClient) {}

    teacherLogin(username: string, password: string): Observable<any> {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });

        return this.http.post(`${this.baseUrl}/maestro/login`, formData.toString(), { headers, withCredentials: true });
    }

    studentLogin(username: string, password: string): Observable<any> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return this.http.post(`${this.baseUrl}/alumno/login`, formData, { withCredentials: true });
    }

    logout(): Observable<any> {
        return this.http.get(`${this.baseUrl}/logout`, { withCredentials: true });
    }
}
