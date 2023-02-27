import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { passwordFormat } from 'src/app/formats/dateFormat';
import { ResetPasswordDto } from 'src/app/models/User/resetPasswordDto';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends SelfUnsubscriberBase implements OnInit {
  token = this.activatedRoute.snapshot.paramMap.get("token") as string;
  resetPasswordForm: FormGroup;

  password?: FormControl;
  confirmPassword?: FormControl;
  userId!: Guid;

  constructor(
    public formBuilder: FormBuilder,
    public route: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) { 
    super();

    this.password = new FormControl('',[Validators.pattern(passwordFormat), Validators.minLength(8)])
    this.confirmPassword = new FormControl('',[Validators.pattern(passwordFormat), Validators.minLength(8)])

    this.resetPasswordForm = this.formBuilder.group({
      'newPassword': this.password,
      'repeatNewPassword': this.confirmPassword,
    })
  }

  ngOnInit(): void {
    console.log(this.token);
    this.userService.getUserIdByResetPasswordToken(this.token)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.userId = result;
      },
      (error) => {
        this.route.navigate(["page-not-found"]);
      })
  }

  resetPassword(resetPassword: ResetPasswordDto){
    resetPassword.id = this.userId;
    this.userService.resetPassword(resetPassword)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['login']);
      });
  }
}
