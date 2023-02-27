import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
import { AssignmentListUtilDto } from '../models/AssignmentList/AssignmentListUtilDto';
import { AssignmentListTypeDto } from '../models/AssignmentListTypeDto';
import { CreateAssignmentListDto } from '../models/AssignmentList/createAssignmentListDto';
import { UpdateAssignmentListDto } from '../models/AssignmentList/updateAssignmentListDto';
import { AssignmentListDto } from '../models/AssignmentList/assignmentListDto';
import { AssignmentListUserDto } from '../models/AssignmentList/AssignmentListUserDto';

@Injectable({
  providedIn: 'root'
})
export class AssignmentListService {
  pipe() {
    throw new Error('Method not implemented.');
  }

  private _url = 'AssignmentList'

  constructor(private http: HttpClient) { }

  public createAssignmentList(createAssignmentList: CreateAssignmentListDto): Observable<AssignmentListDto>{
    return this.http.post<AssignmentListDto>(`${environment.apiUrl}/${this._url}`, createAssignmentList)
  }

  public updateAssignmentList(updateAssignmentList: UpdateAssignmentListDto): Observable<string>{
    const options = {
      responseType: 'text' as 'json',
    };
    return this.http.put<string>(`${environment.apiUrl}/${this._url}`, updateAssignmentList, options)
  }

  public updateAdministrativeAssignmentList(updateAssignmentList: UpdateAssignmentListDto): Observable<string>{
    const options = {
      responseType: 'text' as 'json',
    };
    return this.http.put<string>(`${environment.apiUrl}/${this._url}/AdministrativeList`, updateAssignmentList, options)
  }

  public convertPrivateToSharedAssignmentList(assignmentListId: Guid){
    console.log(assignmentListId)
    return this.http.put(`${environment.apiUrl}/${this._url}/convertToShared?assignmentListId=${assignmentListId}`, assignmentListId)
  }

  public getAssignmentList(assignmentListDto: AssignmentListTypeDto){
    return this.http.post<any>(`${environment.apiUrl}/${this._url}/filterByListTypeAsync`, assignmentListDto)
  }

  public deleteAssignmentList(id: Guid){
    return this.http.delete(`${environment.apiUrl}/${this._url}/${id}`)
  }

  public deleteAdministrativeAssignmentList(id: Guid){
    return this.http.delete(`${environment.apiUrl}/${this._url}/AdministrativeList?id=${id}`)
  }

  public getAssignmentListById(id: Guid):Observable<AssignmentListUtilDto>{
    return this.http.get<AssignmentListUtilDto>(`${environment.apiUrl}/${this._url}/${id}`)
  }

  public createAdministrativeAssignmentList(createAdministrativeAssignmentList: AssignmentListUtilDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/AdministrativeList`, createAdministrativeAssignmentList);
  }

  public getAssignmentListName(id: Guid): Observable<string>{
    const options = {
      responseType: 'text' as 'json',
    };
    return this.http.get<string>(`${environment.apiUrl}/${this._url}/getAssignmentListName?assignmentListId=${id}`, options)
  }

  public addAssignmentListToUser(assignmentListUserDto: AssignmentListUserDto): Observable<string>{
    const options = {
      responseType: 'text' as 'json',
    };
    return this.http.put<string>(`${environment.apiUrl}/${this._url}/addUser`, assignmentListUserDto, options)
  }
}
