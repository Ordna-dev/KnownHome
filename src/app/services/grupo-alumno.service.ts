import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoAlumnoService {
  private baseUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getGroup(groupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo-alumno/grupo/${groupId}`, { withCredentials: true });    
  }

  getEnrolledStudents(groupId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/grupo-alumno/${groupId}/students`, { withCredentials: true });
  }

  leaveGroup(groupId: number): Observable<any> {
    const formData = new FormData();
    formData.append('id_grupo', groupId.toString());

    const options = {
        withCredentials: true,
        body: formData 
    };

    return this.http.delete(`${this.baseUrl}/grupo-alumno/student-leave-group`, options);
  }
}