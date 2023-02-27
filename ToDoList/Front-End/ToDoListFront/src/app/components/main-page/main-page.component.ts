import { Component, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { UserProfileDetailsService } from '../../services/user-profile-details.service';
import { UserDetailsDto } from 'src/app/models/User/userDetailsDto';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent extends SelfUnsubscriberBase implements OnInit {
  title = 'Welcome'
  userDetailsDto?: UserDetailsDto;
  private userId = localStorage.getItem('id') as unknown as Guid;

  constructor(
    private userProfileDetailsService : UserProfileDetailsService,
    private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.userProfileDetailsService.getUserDetails(this.userId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.userDetailsDto = result;
    });

    this.titleService.setTitle(this.title)
  }

}
