import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ResetPasswordDto } from '../models/User/resetPasswordDto';
import { UserLoginDetailsDto } from '../models/User/userLoginDetailsDto';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService{
  public errorMessage: string = ''
  public detail: string = ''

  constructor() { }

  public setErrorAlert(error: string){
    Swal.fire({
      icon: 'error',
      title: 'Trouble',
      text: error
    });
  }

  public setSuccesAlert(succes: string){
    Swal.fire({
      icon: 'success',
      title: 'Succes',
      text: succes
    })
  }

  public handleError<T>(_ = 'operation', result?: T){
    return (error: any): Observable<T> => {
      this.detail = error.error.Detail
      this.setErrorAlert(this.errorMessage)
      return of(result as T)
    }
  }

  public checkLoginFields(user: UserLoginDetailsDto){
    if (!user.password || !user.userCredentials) {
      this.errorMessage = "Username and password are mandatory";
      return false;
    }
    
    return true;
  }

  public checkResetPasswordFields(user: ResetPasswordDto){
    if (!user.newPassword || !user.id || !user.repeatNewPassword) {
      this.errorMessage = "Email and passwords are mandatory";
      return false;
    }

    return true;
  }

  public displayInvalidParameter(message: string){
    this.setErrorAlert(message)
  }

  public displaySuccesAlert(message: string){
    this.setSuccesAlert(message)
  }

}
