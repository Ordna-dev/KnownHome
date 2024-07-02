import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardMaestroService {
    // AGM 15/02/2024 - Refactorizacion de codigo de dashboard maestro
    private baseUrl: string = 'http://localhost:5000'; 
    // 192.168.1.69:5000

    constructor(private http: HttpClient) {}

    registerStudentService(username: string, password: string): Observable<any> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return this.http.post(`${this.baseUrl}/alumno/register`, formData, { withCredentials: true });
    }

    registerStudentsBulkService(alumnos: any[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/alumno/bulk-register`, { alumnos }, { withCredentials: true });
    }

    getGroupsService(): Observable<any> {
        return this.http.get(`${this.baseUrl}/maestro`, { withCredentials: true });
    }

    getGroupsByQuery(query: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/grupo-alumno/teacher-search-groups?query=${query}`, { withCredentials: true });
    }

    getActiveStudents(): Observable<any> {
        return this.http.get(`${this.baseUrl}/alumno/active-students`, { withCredentials: true });
    }

    getStudentsByQuery(query: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/alumno/my-students?query=${query}`, { withCredentials: true });
    }

    deactivateStudent(studentId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/alumno/deactivate-student/${studentId}`, { withCredentials: true });
    }

    editStudentCredentials(studentId: number, username: string, password: string): Observable<any> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return this.http.put(`${this.baseUrl}/alumno/edit-student/${studentId}`, formData, { withCredentials: true });
    }

    getInactiveStudents(): Observable<any> {
        return this.http.get(`${this.baseUrl}/alumno/inactive-students`, { withCredentials: true });
    }

    getInactiveStudentsByQuery(query: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/alumno/deactivated-students?query=${query}`, { withCredentials: true });
    }

    activateStudent(studentId: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/alumno/activate-student/${studentId}`, {}, { withCredentials: true });
    }

    createGroupService(nombre: string, descripcion: string): Observable<any> {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        return this.http.post(`${this.baseUrl}/grupo/create`, formData, { withCredentials: true });
    }

    deleteGroupService(groupId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/grupo/delete/${groupId}`, { withCredentials: true });
    }

    getGroupService(groupId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/grupo/${groupId}`, { withCredentials: true });
    }

    updateGroupService(groupId: number, nombre: string, descripcion: string): Observable<any> {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        return this.http.put(`${this.baseUrl}/grupo/update/${groupId}`, formData, { withCredentials: true });
    }

    logOutService(): Observable<any> {
        return this.http.get(`${this.baseUrl}/auth/logout`, { withCredentials: true, responseType: 'text' });
    }
}