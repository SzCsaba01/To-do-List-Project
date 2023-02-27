import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private url: string = "Role"

  constructor(private http: HttpClient) { }

  public getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${environment.apiUrl}/${this.url}`)
  }
}
