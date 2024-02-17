import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardAlumnoService {
    private baseUrl: string = 'http://localhost:5000'; 

    constructor(private http: HttpClient) {}

    getGroups(): Observable<any> {
        return this.http.get(`${this.baseUrl}/alumno`, { withCredentials: true });
    }

    getGroup(groupId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/grupo/${groupId}`, { withCredentials: true });
    }

    enrollStudentInGroup(groupCode: string): Observable<any> {
        const formData = new FormData();
        formData.append('codigo_acceso', groupCode);
    
        return this.http.post('http://localhost:5000/grupo-alumno/join-group', formData, { withCredentials: true });
    }

    logOut(): Observable<any> {
        return this.http.get(`${this.baseUrl}/auth/logout`, { withCredentials: true, responseType: 'text' });
    }
}