import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateReminderDto } from '../models/Reminder/CreateReminderDto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  private _url: string = 'Reminder'

  constructor(private http: HttpClient) { }

  public createReminder(reminder: CreateReminderDto): Observable<Date>{
    return this.http.post<Date>(`${environment.apiUrl}/${this._url}`, reminder);
  }

  public updateReminder(reminder: CreateReminderDto): Observable<Date>{
    return this.http.put<Date>(`${environment.apiUrl}/${this._url}/editReminderByUserandAssignmentId`, reminder);
  }
}
