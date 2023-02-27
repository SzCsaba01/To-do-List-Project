import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AppConstants } from 'src/app/constants/AppConstants';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { AssignmentListDto } from 'src/app/models/AssignmentList/assignmentListDto';
import { AssignmentListTypeDto } from 'src/app/models/AssignmentListTypeDto';
import { CreateAssignmentListDto } from 'src/app/models/AssignmentList/createAssignmentListDto';

@Component({
  selector: 'app-shared-list',
  templateUrl: './shared-list.component.html',
  styleUrls: ['./shared-list.component.scss']
})
export class SharedListComponent extends SelfUnsubscriberBase implements OnInit {
  title = 'Shared list';

  isShownNewSharedList:boolean = false;
  userId: Guid = localStorage.getItem('id') as unknown as Guid;
  assignmentListTypeDto: AssignmentListTypeDto = new AssignmentListTypeDto()

  lists: AssignmentListDto[] = []

  public newListForm!:FormGroup;
  newListName?: FormControl;
  listName: string = "";
  newAssignmentListDto: CreateAssignmentListDto = new CreateAssignmentListDto();

  constructor(
    private assignmentListService: AssignmentListService,
    private route: Router,
    private formBulider: FormBuilder,
    private titleService: Title
  ){  
    super();
    this.assignmentListTypeDto.userId = this.userId;
    this.assignmentListTypeDto.listType = 2;
  
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

  isShownNewSharedListStatus(){
    this.isShownNewSharedList = !this.isShownNewSharedList;
  }

  goToDetailsList(list: AssignmentListDto){
    this.route
      .navigateByUrl(`blank`, {skipLocationChange: true})
      .then(() => this.route.navigate([`shared-list-details/${list.id}`]))
  }

  createNewList() {
    this.newAssignmentListDto.name = this.newListForm.get('listName')?.value;
    this.newAssignmentListDto.userId = this.userId
    this.newAssignmentListDto.listType = AppConstants.SHARED_LIST;
    
    this.assignmentListService.createAssignmentList(this.newAssignmentListDto)
    .pipe(takeUntil(this.ngUnsubscribe))  
    .subscribe(result => {
      this.lists.push(result);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'A new shared list added successfully',
        timer: 1000
      })
    });

    this.isShownNewSharedListStatus();
  }

  clearNewListForm()
  {
    this.newListName?.reset();
  }

}
 