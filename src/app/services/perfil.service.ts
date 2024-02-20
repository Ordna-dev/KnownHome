import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private baseUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/maestro/my-profile`, { withCredentials: true });    
  }

  updateUser(username: string | null | undefined, password: string | null | undefined, confirmar_password: string | null | undefined): Observable<any> {
    const formData = new FormData();
    if (username) formData.append('username', username);
    if (password) formData.append('password', password);
    if (confirmar_password) formData.append('confirmar_password', confirmar_password)
  
    // Asegúrate de que solo se llame al endpoint si al menos uno de los campos no es nulo/undefined
    if (username || password) {
      return this.http.put(`${this.baseUrl}/maestro/update-profile`, formData, { withCredentials: true });
    } else {
      // Puedes manejar este caso como prefieras, quizás lanzando un error o devolviendo un Observable vacío
      return throwError(() => new Error('Se requiere al menos un campo (username o password) para actualizar'));
    }
  }
  

  logOutService(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/logout`, { withCredentials: true, responseType: 'text' });
  }
}