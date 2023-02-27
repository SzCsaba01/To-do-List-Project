import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { forkJoin, takeUntil } from 'rxjs';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { UserProfileDetailsService } from '../../services/user-profile-details.service';
import { UserDetailsDto } from 'src/app/models/User/userDetailsDto';
import { EditUserDto } from 'src/app/models/User/EditUserDto';
import { UploadUserProfilePictureDto } from 'src/app/models/User/UploadUserProfilePictureDto';
import { Title } from '@angular/platform-browser';
import { AssignmentService } from 'src/app/services/assignment.service';
import { NumberOfAssignmentsDto } from 'src/app/models/Assignment/NumberOfAssignmnetsDto';
import { AppConstants } from 'src/app/constants/AppConstants';
import { ChartData, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent extends SelfUnsubscriberBase implements OnInit {
  displayEditDetails = "none";

  userDetailsDto?: UserDetailsDto;

  editUserForm!: FormGroup;

  uploadProfilePicture!:UploadUserProfilePictureDto; 

  userName?: FormControl;
  email?: FormControl;
  firstName?: FormControl;
  lastName?: FormControl;

  nrOfPrivateAssignments?: Number;
  numberOfPrivateAsignmentsDto: NumberOfAssignmentsDto = new NumberOfAssignmentsDto();
  nrOfSharedAssignments?: Number;
  numberOfSharedAsignmentsDto: NumberOfAssignmentsDto = new NumberOfAssignmentsDto();
  nrOfAdministrativeAssignments?: Number;
  numberOfAdministrativeAsignmentsDto: NumberOfAssignmentsDto = new NumberOfAssignmentsDto();

  nrOfCompletedPrivateAssignments?: Number;
  nrOfCompletedSharedAssignments?: Number;
  nrOfCompletedAdministrativeAssignments?: Number;

  tasksData!: ChartData<'pie'>;
  completedTasksData!: ChartData<'line'>

  title: string = 'Profile Details';

  private userId = localStorage.getItem('id') as unknown as Guid;

  constructor(
    private formBuilder: FormBuilder,
    private userProfileDetailsService : UserProfileDetailsService,
    private titleService: Title,
    private assignmentService: AssignmentService,
    private route: Router,
  ) { 
    super();
    
    this.userName = new FormControl('',[Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-Z0-9]*'), Validators.maxLength(20)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.firstName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]);
    this.lastName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]);

    this.editUserForm = this.formBuilder.group({
      'userName': this.userName,
       'email': this.email,
       'firstName': this.firstName,
       'lastName': this.lastName,
   })

   this.uploadProfilePicture = new UploadUserProfilePictureDto();
   this.uploadProfilePicture.file = new FormData();
   this.uploadProfilePicture.userId = this.userId;

   this.numberOfPrivateAsignmentsDto.userId = this.userId;
   this.numberOfPrivateAsignmentsDto.listType = AppConstants.PRIVATE_LIST;

   this.numberOfSharedAsignmentsDto.userId = this.userId;
   this.numberOfSharedAsignmentsDto.listType = AppConstants.SHARED_LIST;

   this.numberOfAdministrativeAsignmentsDto.userId = this.userId;
   this.numberOfAdministrativeAsignmentsDto.listType = AppConstants.ADMINISTRATIVE_LIST;
  }
  
  ngOnInit(): void {
    forkJoin([this.userProfileDetailsService.getUserDetails(this.userId),
      this.assignmentService.getNumberOfAssignmentByListTypeForUser(this.numberOfPrivateAsignmentsDto),
      this.assignmentService.getNumberOfAssignmentByListTypeForUser(this.numberOfSharedAsignmentsDto),
      this.assignmentService.getNumberOfAssignmentByListTypeForUser(this.numberOfAdministrativeAsignmentsDto),
      this.assignmentService.getNumberOfCompletedAssignmentsTodayByListTypeForUser(this.numberOfPrivateAsignmentsDto),
      this.assignmentService.getNumberOfCompletedAssignmentsTodayByListTypeForUser(this.numberOfSharedAsignmentsDto),
      this.assignmentService.getNumberOfCompletedAssignmentsTodayByListTypeForUser(this.numberOfAdministrativeAsignmentsDto)])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([userDetails, privateAssignments, sharedAssignments, administrativeAssignments, privateCompletedAssignments, sharedCompletedAssignments, administrativeCompletedAssignments]) =>{
        this.userDetailsDto = userDetails;
        this.nrOfPrivateAssignments = privateAssignments;
        this.nrOfSharedAssignments = sharedAssignments;
        this.nrOfAdministrativeAssignments = administrativeAssignments;
        this.nrOfCompletedPrivateAssignments = privateCompletedAssignments
        this.nrOfCompletedSharedAssignments = sharedCompletedAssignments
        this.nrOfCompletedAdministrativeAssignments = administrativeCompletedAssignments;

        this.tasksData = {
          labels: ["Private Tasks", "Shared Tasks", "Administrative Tasks"],
          datasets: [{
            label: 'Tasks',
            data: [privateAssignments, sharedAssignments, administrativeAssignments],
          }],
        }

        this.completedTasksData  = {
          labels: ["Private Tasks", "Shared Tasks", "Administrative Tasks"],
          datasets: [{
            label: 'Completed Tasks Today',
            data: [privateCompletedAssignments, sharedCompletedAssignments, administrativeCompletedAssignments],
          }],
        }

        this.initializeForm();
      })

    this.titleService.setTitle(this.title);
  }

  chartClick(event: any){
    if(!event.active[0]){
      return;
    }

    switch(event.active[0].index){
      case 0 :
        this.route.navigate([`private-list`]);
        break;
      case 1:
        this.route.navigate([`shared-list`]);
        break;
      case 2:
        this.route.navigate([`administrative-list`]);
        break;
      default:
        this.route.navigate([`home`]);
        break;
    }
  }

  openEditDetails() {
    this.displayEditDetails = "block";
  }

  onCloseEditDetails() {
    this.displayEditDetails = "none";
  }

  initializeForm(){
    this.userName?.setValue(this.userDetailsDto?.userName);
    this.email?.setValue(this.userDetailsDto?.email);
    this.firstName?.setValue(this.userDetailsDto?.firstName);
    this.lastName?.setValue(this.userDetailsDto?.lastName);

    this.editUserForm.patchValue({
      'userName': this.userName?.value,
       'email': this.email?.value,
       'firstName': this.firstName?.value,
       'lastName': this.lastName?.value,
    })
  }

  ChangeEditUserName(){
   this.userName
  }

  onChangeProfilePicture(files : any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      reader.readAsDataURL(fileToUpload);
      this.uploadProfilePicture.file!.append('file', fileToUpload, fileToUpload.name);
      this.uploadProfilePicture.file!.append('userId', this.uploadProfilePicture.userId as unknown as string);
  
      reader.onload = () => {
        this.uploadProfilePicture.path = reader.result as string;
        this.userDetailsDto!.profilePicture = this.uploadProfilePicture.path;
      }
    }
  }

  onSaveChanges(){
    if(!this.uploadProfilePicture.path){
      return;
    }

    this.userProfileDetailsService.uploadProfilePicture(this.uploadProfilePicture.file!)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe();
  }

  onSaveProfileDetailsChanges(editUserDetails: EditUserDto){
    editUserDetails.id = this.userDetailsDto!.id;
    
    this.userProfileDetailsService
      .editUserDetails(editUserDetails)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.userDetailsDto!.userName = editUserDetails.userName;
        this.userDetailsDto!.email = editUserDetails.email;
        this.userDetailsDto!.firstName = editUserDetails.firstName;
        this.userDetailsDto!.lastName = editUserDetails.lastName;
      }
      );
  }

}
