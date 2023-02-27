import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import * as moment from 'moment';
import { forkJoin, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalStates } from 'src/app/enums/ModalStates';
import { AppConstants } from 'src/app/constants/AppConstants';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { ReminderService } from 'src/app/services/reminder.service';
import { AssignmentService } from 'src/app/services/assignment.service';
import { UserService } from 'src/app/services/user.service';
import { CreateAssignmentDto } from 'src/app/models/Assignment/CreateAssignmentDto';
import { CreateReminderDto } from 'src/app/models/Reminder/CreateReminderDto';
import { GetAssignmentsForUser } from 'src/app/models/Assignment/GetAssignmentsForUser';
import { GetAssignmentDto } from 'src/app/models/Assignment/GetAssignmentDto';
import { UpdateAssignmentListDto } from 'src/app/models/AssignmentList/updateAssignmentListDto';
import { AssignmentUtilDto } from 'src/app/models/Assignment/AssignmentUtilDto';
import { AssignmentListUserDto } from 'src/app/models/AssignmentList/AssignmentListUserDto';


@Component({
  selector: 'app-shared-list-details',
  templateUrl: './shared-list-details.component.html',
  styleUrls: ['./shared-list-details.component.scss']
})
export class SharedListDetailsComponent extends SelfUnsubscriberBase implements OnInit {
  assignmentListId = this.route.snapshot.paramMap.get("assignmentListId") as unknown as Guid;
  assignmentListName!: string;
  getAssignmentForUser: GetAssignmentsForUser = new GetAssignmentsForUser();
  
  tasks: GetAssignmentDto[] = [];
  membersList: string[] = [];

  editedTaskIndex: number = 0;

  newMember: boolean = false;

  modalState: string = 'None';
  modalStateEnum = ModalStates;

  assignmentListUserDto: AssignmentListUserDto = new AssignmentListUserDto();

  actualTime!: string;
  defaultDate = AppConstants.DEFAULT_DATE;

  listName: string = "";
  assignmentName: string = "";
  assignmentDeadline: Date = new Date();
  assignmentReminder: Date = new Date();

  public modifyListForm!:FormGroup;
  public assignmentForm!:FormGroup;
  public addUserToListForm!: FormGroup;
  public createReminderForm!: FormGroup;

  newAssignmentName?: FormControl;
  newAssignmentDeadline?: FormControl;
  newAssignmentReminder?: FormControl;
  newListName?: FormControl;
  addUserToList?: FormControl;
  newReminder?: FormControl;

  createAssignmenDto: CreateAssignmentDto = new CreateAssignmentDto();
  createReminderDto: CreateReminderDto = new CreateReminderDto();
  modifyAssignmentListDto: UpdateAssignmentListDto = new UpdateAssignmentListDto();
  updateAssignmentDto: AssignmentUtilDto = new AssignmentUtilDto();

  isShownTaskDetails: boolean[] = [];

  deleteAssignmentId!: Guid;
  deleteAssignmentIndex!: number;

  title: string = 'Shared list details';

  constructor(
    private route: ActivatedRoute,
    private assignmentListService: AssignmentListService,
    private assignmentService: AssignmentService,
    private userService: UserService,
    private navRoute: Router,
    private formBuilder: FormBuilder,
    private routeToExport: Router,
    private titleService: Title,
    private reminderService: ReminderService
  ) { 
      super()
      this.getAssignmentForUser.UserId = localStorage.getItem("id") as unknown as Guid;
      this.getAssignmentForUser.AssignmentListId = this.assignmentListId;
      
      this.newAssignmentName = new FormControl('', [Validators.required, Validators.minLength(1)]),
      this.newAssignmentDeadline = new FormControl('', [Validators.required, Validators.minLength(1)]),
      this.newAssignmentReminder = new FormControl('', [Validators.required, Validators.minLength(1)]),
      this.newListName = new FormControl('',[Validators.required, Validators.minLength(1)]),
      this.addUserToList = new FormControl('', [Validators.required, Validators.email]),
      this.newReminder = new FormControl('', [Validators.required])

      this.addUserToListForm = this.formBuilder.group({
        'addUser': this.addUserToList
      });
  }

  

  ngOnInit() {
    forkJoin([this.assignmentListService.getAssignmentListName(this.assignmentListId), 
      this.assignmentService.getAssignmentForUser(this.getAssignmentForUser),
      this.userService.getUsersForList(this.assignmentListId)])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([name, assignments, members]) => {
        this.assignmentListName = name
        this.tasks = assignments
        this.membersList = members
        this.modifyListNameFormInit(this.assignmentListName)
      })

      this.titleService.setTitle(this.title);
  }

  createReminderFormInit(deadline:Date)
  {
    this.createReminderForm = this.formBuilder.group({
      newAssignmentDeadline: [deadline, Validators.required],
      newAssignmentReminder: ['', Validators.required]
    },
    {validator: this.dateLessThan('newAssignmentReminder', 'newAssignmentDeadline')});
  }

  createAssignmentFormInit()
  {
    this.assignmentForm = this.formBuilder.group({
      newAssignmentName: ['', Validators.required],
      newAssignmentDeadline: ['', Validators.required],
      newAssignmentReminder: ['', Validators.required]
    },
    {validator: this.dateLessThan('newAssignmentReminder', 'newAssignmentDeadline')});
  }

  modifyListNameFormInit(newName: string)
  {
    this.modifyListForm = this.formBuilder.group({
      newListName : [newName, Validators.required]
    })
  }

  modifyAssignmentFormInit(deadline:Date, reminder:Date, name:string){
    this.assignmentForm = this.formBuilder.group({
      newAssignmentName: [name, Validators.required],
      newAssignmentDeadline: [deadline, Validators.required],
      newAssignmentReminder: [reminder, Validators.required]
    },
    {validator: this.dateLessThan('newAssignmentReminder', 'newAssignmentDeadline')});
  }

  deleteAssignmentInit(deleteAssignmentId: Guid, deleteAssignmentIndex: number)
  {
    this.deleteAssignmentId = deleteAssignmentId;
    this.deleteAssignmentIndex = deleteAssignmentIndex;
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'The reminder should be sent before the deadline'
        };
      }
      return {};
    }
  }

  getActualTime()
  {
    this.actualTime = moment(new Date()).format('YYYY-MM-DD hh:mm') ;
  }

  goToExportPage(){
    this.routeToExport
    .navigateByUrl(`blank`, {skipLocationChange: true})
    .then(() => this.routeToExport.navigate([`/sort-filter-export/${this.assignmentListId}`]))
  }

  setModalState(i:number){
    this.modalState = ModalStates[i];
  }

  addNewMember(){
    this.assignmentListUserDto.email = this.addUserToListForm.get('addUser')?.value;
    this.assignmentListUserDto.assignmentListId = this.assignmentListId;

    this.assignmentListService.addAssignmentListToUser(this.assignmentListUserDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.membersList.push(result);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'A new member was added successfully',
          timer: 1000
        })
      })

    this.newMember = !this.newMember;
  }

  addNewMemberSwitchModal(){
    this.newMember = !this.newMember;
  }

  changeTaskExpanded(index:number){
    this.tasks[index].isDetailsExpanded = !this.tasks[index].isDetailsExpanded;
  }

  modifyListName()
  {
    this.modifyAssignmentListDto.name = this.modifyListForm.get('newListName')?.value;
    this.modifyAssignmentListDto.id = this.assignmentListId;

    this.assignmentListService.updateAssignmentList(this.modifyAssignmentListDto)
      .pipe(takeUntil(this.ngUnsubscribe))  
      .subscribe((result: string) => {
        this.assignmentListName = result;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'List name updated successfully',
          timer: 1000
        })
      });
  }

  deleteList(){
    this.assignmentListService
      .deleteAssignmentList(this.assignmentListId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() =>
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'List deleted successfully',
          timer: 1000
        })
      )

    this.navRoute
      .navigate([`/shared-list`])
  }

  createAssignment(){
    this.createAssignmenDto.name = this.assignmentForm.get('newAssignmentName')?.value;
    this.createAssignmenDto.deadline = this.assignmentForm.get('newAssignmentDeadline')?.value;
    this.createAssignmenDto.status = false;
    this.createAssignmenDto.assignmentListId = this.assignmentListId;
    this.createAssignmenDto.userId = localStorage.getItem("id") as unknown as Guid;
    this.createAssignmenDto.reminderDate = this.assignmentForm.get('newAssignmentReminder')?.value;

    this.assignmentService.createAssignment(this.createAssignmenDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.tasks.push(result);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Task created successfully',
          timer: 1000
        })
      })
  }
 
  deleteAssignment(assignmentId:Guid, index: number)
  {
    this.assignmentService
      .deleteAssignment(assignmentId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.tasks.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Task deleted successfully',
          timer: 1000
        })
      })
  }

  setEditedTaskIndex(index: number)
  {
    this.editedTaskIndex = index;
  }

  updateAssignment(){
    this.updateAssignmentDto.name = this.assignmentForm.get('newAssignmentName')?.value;
    this.updateAssignmentDto.assignmentId = this.tasks[this.editedTaskIndex].id
    this.updateAssignmentDto.deadline = this.assignmentForm.get('newAssignmentDeadline')?.value;
    this.updateAssignmentDto.userId = localStorage.getItem("id") as unknown as Guid;
    this.updateAssignmentDto.reminder = this.assignmentForm.get('newAssignmentReminder')?.value;

    this.assignmentService.updateAssignment(this.updateAssignmentDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.tasks[this.editedTaskIndex] = result
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Task updated successfully',
          timer: 1000
        })
      })
  }

  createReminder(){
    this.createReminderDto.assignmentId = this.tasks[this.editedTaskIndex].id
    this.createReminderDto.userId = localStorage.getItem("id") as unknown as Guid;
    this.createReminderDto.date = this.createReminderForm.get('newAssignmentReminder')?.value;

    this.reminderService.createReminder(this.createReminderDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.tasks[this.editedTaskIndex].reminder = result;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Remider added successfully',
          timer: 1000
        })
      })
  }
  
  clearNewAssignmentForm()
  {
    this.assignmentForm.reset()
  }

  clearNewMember(){
    this.addUserToList?.reset();
  }

  changeTaskCompleted(task: GetAssignmentDto){
    const taskId = task.id as unknown as Guid;
    
    this.assignmentService.changeAssignmentStatus(taskId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => task.status = result)
  }

  checkDefaultDate(index: number){
    const taskReminder = this.tasks[index].reminder as unknown as string
    return taskReminder === this.defaultDate;
  }

  refreshData(){
    this.assignmentService.getAssignmentForUser(this.getAssignmentForUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.tasks = result)
  }

  orderAssignmentsByStatusAndDeadline(){
    this.assignmentService.orderAssignmentsByStatusAndDeadline(this.getAssignmentForUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.tasks = result)
  }
}
