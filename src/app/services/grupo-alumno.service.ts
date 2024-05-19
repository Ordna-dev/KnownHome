import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoAlumnoService {
  private baseUrl: string = 'http://localhost:5000/';

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

  uploadPhoto(groupId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const options = {
      withCredentials: true
    };

    return this.http.post(`${this.baseUrl}/imagenes-alumno/group/${groupId}/upload`, formData, options);
  }

  getStudentPhotos(groupId: number, studentId: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-alumno/group/${groupId}/student-photos/${studentId}`, {withCredentials: true})
  }
  
  getStudentPhotoDetail(groupId: number,  studentId: number, photoId: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-alumno/group/${groupId}/student-photos/${studentId}/detail/${photoId}`, {withCredentials: true})
  }

  
  getTeacherPhotos(groupId: number, teacherId: number) : Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-alumno/group/${groupId}/teacher-photos/${teacherId}`, {withCredentials: true})
  }

  getTeacherPhotoDetail(groupId: number,  teacherId: number, photoId: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-alumno/group/${groupId}/teacher-photos/${teacherId}/detail/${photoId}`, {withCredentials: true})
  }

}