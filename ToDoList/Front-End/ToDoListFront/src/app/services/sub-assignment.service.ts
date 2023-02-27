import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
import { AddSubAssignmentDto } from '../models/SubAssignment/AddSubAssignmentDto';
import { ChangeAllSubAssignmentStatusDto } from '../models/SubAssignment/ChangeAllSubAssignmentStatus';
import { UpdateSubAssignmentDto } from '../models/SubAssignment/UpdateSubAsignmentDto';

@Injectable({
  providedIn: 'root'
})
export class SubAssignmentService {

  private _url = 'SubAssignment'

  constructor(private http: HttpClient) { }

  public switchSubAssignmentStatus(id: Guid){
    return this.http.put(`${environment.apiUrl}/${this._url}/SwitchStatus/${id}`, null);
  }

  public addSubAssignment(addSubAssignmentDto: AddSubAssignmentDto){
    return this.http.post<any>(`${environment.apiUrl}/${this._url}/Add`, addSubAssignmentDto);
  }

  public deleteSubAssignment(id: Guid){
    return this.http.delete(`${environment.apiUrl}/${this._url}/Delete?id=${id}`);
  }

  public updateSubAssignment(updateSubAssignmentDto: UpdateSubAssignmentDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/Update`, updateSubAssignmentDto);
  }

  public changeAllSubAssignmentStatus(changeAllSubAssignmentStatus: ChangeAllSubAssignmentStatusDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/ChangeAllSubAssignmentStatus`, changeAllSubAssignmentStatus);
  }
}
