import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Guid } from 'guid-typescript';
import { UserDetailsDto } from '../models/User/userDetailsDto';
import { EditUserDto } from '../models/User/EditUserDto';

const options = {
  responseType: 'text' as 'json',
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileDetailsService {

  private _url = 'User';

  constructor(private http: HttpClient) { }
  
  public uploadProfilePicture(uploadUserProfilePicture: FormData){
    return this.http.put(`${environment.apiUrl}/${this._url}/UploadUserProfilePicture`, uploadUserProfilePicture);
  }

  public getUserDetails(id:Guid): Observable<UserDetailsDto>{
    return this.http.get<UserDetailsDto>(`${environment.apiUrl}/${this._url}/UserDetails?id=${id}`);
  }

  public getUserProfilePictureUrl(id: Guid): Observable<string>{
    return this.http.get<string>(`${environment.apiUrl}/${this._url}/GetFileUrl?Id=${id}`, options);
  }

  public editUserDetails(editUserDetails: EditUserDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/Edit`, editUserDetails);
  }
}
