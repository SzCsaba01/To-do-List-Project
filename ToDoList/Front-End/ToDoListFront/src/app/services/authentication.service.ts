import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserLoginDetailsDto } from '../models/User/userLoginDetailsDto'; 
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  headers = new HttpHeaders().set('Content-type', 'application/json')
  _url: string = "Authentication"
  
  constructor(
    private http:HttpClient,
    public route:Router,
    private errorService: ErrorHandlerService){}

  login(user: UserLoginDetailsDto){
    return this.http
      .post<any>(`${environment.apiUrl}/${this._url}/login`, user)
      .pipe(
        map((response: {token: string, id: string, role: string}) => {
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('id', response.id);
        localStorage.setItem('role', response.role);
        return response.token;
      }),
      catchError(this.errorService.handleError<any>())
    );
  } 

  logout(){
      localStorage.removeItem('access_token');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      this.route.navigate(['/login']);
  }

  getAcessToken(){
    return localStorage.getItem('access_token')
  }

  isAuthenticated(){
    let token = this.getAcessToken()
    return (token != null && token != undefined && token != '')
  }

  getUserRole(){
    return localStorage.getItem('role')
  }

}
