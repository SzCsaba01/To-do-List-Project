import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Guid } from 'guid-typescript';
import { takeUntil, timer } from 'rxjs';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { AppConstants } from 'src/app/constants/AppConstants';
import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { AssignmentListDto } from 'src/app/models/AssignmentList/assignmentListDto';
import { AssignmentListTypeDto } from 'src/app/models/AssignmentListTypeDto';
import { UserRole } from 'src/app/models/User/UserRole';
import { CreateAssignmentListDto } from 'src/app/models/AssignmentList/createAssignmentListDto';

@Component({
  selector: 'app-administrative-list',
  templateUrl: './administrative-list.component.html',
  styleUrls: ['./administrative-list.component.scss']
})
export class AdministrativeListComponent extends SelfUnsubscriberBase implements OnInit {
  title = 'Administrative list';

  public newListForm!:FormGroup;
  newListName?: FormControl;

  userId: Guid = localStorage.getItem('id') as unknown as Guid;
  assignmentListTypeDto: AssignmentListTypeDto = new AssignmentListTypeDto();

  userRole: string = localStorage.getItem('role') as unknown as string;
  expectedRole: string = UserRole.AdminRole;

  isShownLogOut: boolean = false;

  lists: AssignmentListDto[] = [];

  newAssignmentListDto: CreateAssignmentListDto = new CreateAssignmentListDto();

  isShownAdministrativeList!: boolean;

  constructor(
    private assignmentListService: AssignmentListService,
    private route: Router,
    private formBulider: FormBuilder,
    private titleService: Title
  ) { 
    super();
    this.assignmentListTypeDto.userId = this.userId;
    this.assignmentListTypeDto.listType = AppConstants.ADMINISTRATIVE_LIST;

    this.newListName = new FormControl('', [Validators.required, Validators.minLength(1)]),
    this.newListForm = this.formBulider.group({
      'listName': this.newListName});
  }

  ngOnInit() {
    this.assignmentListService.getAssignmentList(this.assignmentListTypeDto)
    .pipe(takeUntil(this.ngUnsubscribe)) 
    .subscribe((result: AssignmentListDto[]) => (this.lists = result))

    this.titleService.setTitle(this.title)
  }

  isShownLogOutStatus()
  {
    this.isShownLogOut = !this.isShownLogOut;
  }

  goToDetailsList(list: AssignmentListDto){
    this.route
      .navigateByUrl(`blank`, {skipLocationChange: true})
      .then(() => this.route.navigate([`administrative-list-details/${list.id}`]))
  }

  isShownAdministrativeListStatus()
  {
    this.isShownAdministrativeList = !this.isShownAdministrativeList;
  }

  createNewList() {
    this.newAssignmentListDto.name = this.newListForm.get('listName')?.value;
    this.newAssignmentListDto.userId = this.userId
    this.newAssignmentListDto.listType = AppConstants.ADMINISTRATIVE_LIST;
    
    this.assignmentListService.createAdministrativeAssignmentList(this.newAssignmentListDto)
    .pipe(takeUntil(this.ngUnsubscribe))  
    .subscribe(result => {
      this.lists.push(result)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'A new administrative list added successfully',
        timer: 1000
      })
    });

    this.isShownAdministrativeListStatus();
  }

  clearNewListForm()
  {
    this.newListName?.reset();
  }
}
