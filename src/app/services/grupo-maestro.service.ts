import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  uploadPhoto(groupId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const options = {
      withCredentials: true
    };

    return this.http.post(`${this.baseUrl}/imagenes-maestro/group/${groupId}/upload`, formData, options);
  }

  getTeacherPhotos(groupId: number) : Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-maestro/group/${groupId}/teacher-photos`, {withCredentials: true});
  }

  getTeacherPhotoDetail(groupId: number, photoId: number): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-maestro/group/${groupId}/teacher-photo/${photoId}`, {withCredentials: true});
  }

  getStudentPhotos(groupId: number, studentId: number | null): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-maestro/group/${groupId}/student-photos/${studentId}`, {withCredentials: true});
  }

  getStudentPhotoDetail(groupId: number, studentId: number, photoId:number): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-maestro/group/${groupId}/student-photo/${studentId}/detail/${photoId}`, {withCredentials: true});
  }
  
  getStudentPhotoEvaluate(groupId: number, photoId:number): Observable<any>{
    return this.http.get(`${this.baseUrl}/imagenes-maestro/group/${groupId}/student-photo/evaluate-photo/${photoId}`, {withCredentials: true});
  }

  authorizeImage(groupdId: number, imageId: number, authorized: boolean, clasification:boolean): Observable<any>{

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let body = {'authorized': authorized, 'clasification': clasification};
    let options = { headers: headers, withCredentials: true };

    return this.http.put(`${this.baseUrl}/imagenes-maestro/group/${groupdId}/authorize-image/${imageId}`, body, options);
  }

  updateImageObject(groupId:number, imageId: number, newObjectId: number | null): Observable<any>{
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    let body = {'new_object': newObjectId};
    let options = { headers: headers, withCredentials: true};

    return this.http.put(`${this.baseUrl}/imagenes-maestro/group/${groupId}/update-image-object/${imageId}`, body, options);
  }
}