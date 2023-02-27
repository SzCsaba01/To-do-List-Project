import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssignmentListTypeDto } from '../models/AssignmentListTypeDto';

@Injectable({
  providedIn: 'root'
})
export class ListTypeService {
  private url: string = "ListType"

  constructor(private http:HttpClient) { }

  public getListTypes(): Observable<AssignmentListTypeDto[]>{
    return this.http.get<AssignmentListTypeDto[]>(`${environment.apiUrl}/${this.url}`)
  }
}
