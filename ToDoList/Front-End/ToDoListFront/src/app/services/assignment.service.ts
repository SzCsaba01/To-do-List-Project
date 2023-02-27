import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
import { GetAssignmentDto } from '../models/Assignment/GetAssignmentDto';
import { GetAssignmentsForUser } from '../models/Assignment/GetAssignmentsForUser';
import { CreateAssignmentDto } from '../models/Assignment/CreateAssignmentDto';
import { AssignmentUtilDto } from '../models/Assignment/AssignmentUtilDto';
import { NumberOfAssignmentsDto } from '../models/Assignment/NumberOfAssignmnetsDto';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private _url: string = 'Assignment'

  constructor(private http: HttpClient) { }

  public createAssignment(assignment: CreateAssignmentDto){
    return this.http.post<GetAssignmentDto>(`${environment.apiUrl}/${this._url}`, assignment);
  }

  public createAdministrativeAssignment(assignment: CreateAssignmentDto){
    return this.http.post<GetAssignmentDto>(`${environment.apiUrl}/${this._url}/AddAdministrativeAssignment`, assignment);
  }

  public getAssignments(): Observable<GetAssignmentDto[]>{
    return this.http.get<GetAssignmentDto[]>(`${environment.apiUrl}/${this._url}`)
  }

  public getAssignmentByName(assignmentName: string): Observable<GetAssignmentDto>{
    return this.http.get<GetAssignmentDto>(`${environment.apiUrl}/${this._url}/${assignmentName}`)
  }

  public updateAssignment(updateAssignment: AssignmentUtilDto): Observable<GetAssignmentDto>{
    return this.http.put<GetAssignmentDto>(`${environment.apiUrl}/${this._url}`, updateAssignment)
  }

  public updateAdministrativeAssignment(updateAssignment: AssignmentUtilDto): Observable<GetAssignmentDto>{
    return this.http.put<GetAssignmentDto>(`${environment.apiUrl}/${this._url}/AdministrativeAssignment`, updateAssignment)
  }

  public deleteAssignment(id: Guid): Observable<GetAssignmentDto>{
    return this.http.delete<GetAssignmentDto>(`${environment.apiUrl}/${this._url}/${id}`)
  }

  public deleteAdministrativeAssignments(id: Guid): Observable<GetAssignmentDto>{
    return this.http.delete<GetAssignmentDto>(`${environment.apiUrl}/${this._url}/AdministrativeAssignment?id=${id}`)
  }

  public changeAssignmentStatus(id: Guid){
    return this.http.put<any>(`${environment.apiUrl}/${this._url}/ChangeStatus/${id}`, null)
  }

  public getAssignmentForUser(getAssignmentsForUser: GetAssignmentsForUser){
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post<any>(`${environment.apiUrl}/${this._url}/getUserAssignmentsFromAssignmentList`, getAssignmentsForUser, httpOptions)
  }

  public orderAssignmentsByStatusAndDeadline(getAssignmentsForUser: GetAssignmentsForUser){
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post<any>(`${environment.apiUrl}/${this._url}/OrderAssignmnetsByDeadlineAndStatusAsync`, getAssignmentsForUser, httpOptions)
  }

  public getNumberOfAssignmentByListTypeForUser(numberOfAssignmentsDto: NumberOfAssignmentsDto): Observable<number>{
    return this.http.post<number>(`${environment.apiUrl}/${this._url}/GetNumberOfAssignmentsByAssignmentTypeForUser`, numberOfAssignmentsDto)
  }

  public getNumberOfCompletedAssignmentsTodayByListTypeForUser(numberOfAssignmentsDto: NumberOfAssignmentsDto): Observable<number>{
    return this.http.post<number>(`${environment.apiUrl}/${this._url}/GetNumberOfCompletedAssignmentsTodayByAssignmentTypeForUser`, numberOfAssignmentsDto)
  }

  public getAssignmentForExcel(getAssignmentsForUser: GetAssignmentsForUser){
    return this.http.post<any>(`${environment.apiUrl}/${this._url}/getUserAssignmentsForExcel`, getAssignmentsForUser)
  }
}
