import { Component, Input, OnInit} from '@angular/core';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { RoleType } from 'src/app/enums/RoleType';
import { UserRole } from 'src/app/models/User/UserRole';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserProfileDetailsService } from 'src/app/services/user-profile-details.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends SelfUnsubscriberBase implements OnInit {

  logOutStatus: boolean = false;

  roleType = RoleType;

  userRole : string = localStorage.getItem('role') as unknown as string;
  expectedRole: string = UserRole.AdminRole;

  @Input() profilePicture?: string;

  private userId = localStorage.getItem('id') as unknown as Guid;

  constructor(
    private authenticationService : AuthenticationService,
    private userProfileDetailsService: UserProfileDetailsService) 
    {
      super();
    }

  ngOnInit(): void {
    this.userProfileDetailsService.getUserProfilePictureUrl(this.userId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      result => {
          this.profilePicture = result;
      }
    )
  }

  changeLogOutStatus()
  {
    this.logOutStatus = !this.logOutStatus;
  }

  onLogout(){
    this.authenticationService.logout();
  }

}
