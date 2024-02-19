import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoMaestroService {
  private baseUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getGroup(groupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo/${groupId}`, { withCredentials: true });    
  }

  updateGroup(groupId: number, nombre: string, descripcion: string): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    return this.http.put(`${this.baseUrl}/grupo/update/${groupId}`, formData, { withCredentials: true });
  }

  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/grupo/delete/${groupId}`, { withCredentials: true });
  }

  getEnrolledStudents(grupoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo-alumno/${grupoId}/enrolled-students`, { withCredentials: true });
  }

  removeStudentFromGroup(studentId: number, groupId: number): Observable<any> {
    const formData = new FormData();
    formData.append('id_alumno', studentId.toString());
    formData.append('id_grupo', groupId.toString());
  
    const options = {
      withCredentials: true,
      body: formData 
    };
  
    return this.http.delete(`${this.baseUrl}/grupo-alumno/teacher-remove-student`, options);
  }
}