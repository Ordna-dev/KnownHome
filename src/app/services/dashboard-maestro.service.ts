import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardMaestroService {
    // AGM 15/02/2024 - Refactorizacion de codigo de dashboard maestro
    private baseUrl: string = 'http://localhost:5000'; 

    constructor(private http: HttpClient) {}

    registrarAlumno(username: string, password: string): Observable<any> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return this.http.post(`${this.baseUrl}/alumno/register`, formData, { withCredentials: true });
    }

    getGrupos(): Observable<any> {
        return this.http.get(`${this.baseUrl}/maestro`, { withCredentials: true });
    }

    crearGrupo(nombre: string, descripcion: string): Observable<any> {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        return this.http.post(`${this.baseUrl}/grupo/create`, formData, { withCredentials: true });
    }

    eliminarGrupo(groupId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/grupo/delete/${groupId}`, { withCredentials: true });
    }

    obtenerGrupo(groupId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/grupo/${groupId}`, { withCredentials: true });
    }

    actualizarGrupo(groupId: number, nombre: string, descripcion: string): Observable<any> {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        return this.http.put(`${this.baseUrl}/grupo/update/${groupId}`, formData, { withCredentials: true });
    }

    cerrarSesion(): Observable<any> {
        return this.http.get(`${this.baseUrl}/auth/logout`, { withCredentials: true, responseType: 'text' });
    }
}