import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Guid } from 'guid-typescript';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs';
import { AppConstants } from 'src/app/constants/AppConstants';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { CreateAssignmentListDto } from 'src/app/models/AssignmentList/createAssignmentListDto';
import { AssignmentListDto } from 'src/app/models/AssignmentList/assignmentListDto';
import { AssignmentListTypeDto } from 'src/app/models/AssignmentListTypeDto';

@Component({
  selector: 'app-private-list',
  templateUrl: './private-list.component.html',
  styleUrls: ['./private-list.component.scss']
})
export class PrivateListComponent extends SelfUnsubscriberBase implements OnInit {
  title = 'Private list';

  public newListForm!:FormGroup;
  newListName?: FormControl;
  listName: string = "";

  isShownNewPrivateList: boolean = false;
  userId: Guid = localStorage.getItem('id') as unknown as Guid;

  assignmentListTypeDto: AssignmentListTypeDto = new AssignmentListTypeDto();
  newAssignmentListDto: CreateAssignmentListDto = new CreateAssignmentListDto();

  lists: AssignmentListDto[] = [];

  constructor(
    private assignmentListService: AssignmentListService,
    private route: Router,
    private formBulider: FormBuilder,
    private titleService: Title
  ){  
    super();
    this.assignmentListTypeDto.userId = this.userId;
    this.assignmentListTypeDto.listType = 1;

    this.newListName = new FormControl('', [Validators.required, Validators.minLength(1)])

    this.newListForm = this.formBulider.group({
      'listName': this.newListName});
  }

  ngOnInit() {
    this.assignmentListService.getAssignmentList(this.assignmentListTypeDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: AssignmentListDto[]) => (this.lists = result))

    this.titleService.setTitle(this.title);
  }

  isShownNewPrivateListStatus(){
    this.isShownNewPrivateList = !this.isShownNewPrivateList;
  }

  goToDetailsList(list: AssignmentListDto){
    this.route
      .navigateByUrl(`blank`, {skipLocationChange: true})
      .then(() => this.route.navigate([`private-list-details/${list.id}`]))
  }

  createNewList() {
    this.newAssignmentListDto.name = this.newListForm.get('listName')?.value;
    this.newAssignmentListDto.userId = this.userId
    this.newAssignmentListDto.listType = AppConstants.PRIVATE_LIST;
    
    this.assignmentListService.createAssignmentList(this.newAssignmentListDto)
    .pipe(takeUntil(this.ngUnsubscribe))  
    .subscribe(result => {
      this.lists.push(result);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'A new private list added successfully',
        timer: 1000
      })
    });

    this.isShownNewPrivateListStatus();
  }

  clearNewListForm()
  {
    this.newListName?.reset();
  }

}
