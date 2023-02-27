import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
import { AddUserDto } from '../models/User/addUserDto';
import { ResetPasswordDto } from '../models/User/resetPasswordDto';
import { ErrorHandlerService } from './error-handler.service';
import { UserPaginationDto } from '../models/User/UserPaginationDto';
import { UserSearchDto } from '../models/User/UserSearchDto';
import { SendForgotPasswordEmailDto } from '../models/User/SendForgotPasswordEmailDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _url = 'User'

  constructor(private http: HttpClient,
    private errorService: ErrorHandlerService) { }

  public createUser(user: AddUserDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/Add`, user);
  }

  public getUserIdByResetPasswordToken(token: string): Observable<Guid>{
    return this.http.get<Guid>(`${environment.apiUrl}/${this._url}/GetUserIdWithResetPasswordToken?token=${token}`)
  }

  public getUsersPaginated(page: number): Observable<UserPaginationDto>{
    return this.http.get<UserPaginationDto>(`${environment.apiUrl}/${this._url}/PaginatedUsers?page=${page}`);
  }

  public deleteUser(userName: String){
    return this.http.delete(`${environment.apiUrl}/${this._url}/Delete?userName=${userName}`);
  }

  public forgotPassword(sendForgotPasswordEmail: SendForgotPasswordEmailDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/ForgotPassword`, sendForgotPasswordEmail);
  }

  public resetPassword(resetPassword: ResetPasswordDto){
    console.log(resetPassword);
    return this.http.put(`${environment.apiUrl}/${this._url}/ResetPassword`, resetPassword);
  }

  public changeArchiveStatus(userName: String){
    return this.http.put(`${environment.apiUrl}/${this._url}/SwitchArchiveStatus?userName=${userName}`, userName);
  }
  
  public getUsersForList(id: Guid): Observable<string[]>{
    return this.http.get<string[]>(`${environment.apiUrl}/${this._url}/getUsersByAssignmentListId?assignmentListId=${id}`)
  }

  public getSearchedUsersByUserName(userSearch: UserSearchDto): Observable<UserPaginationDto>{
    return this.http.post<UserPaginationDto>(`${environment.apiUrl}/${this._url}/SearchUsersByUserName`, userSearch);
  }

  public getSearchedUsersByEmail(userSearch: UserSearchDto): Observable<UserPaginationDto>{
    return this.http.post<UserPaginationDto>(`${environment.apiUrl}/${this._url}/SearchUsersByEmail`, userSearch);
  }
}
