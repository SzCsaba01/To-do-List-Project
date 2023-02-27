import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { forkJoin, takeUntil } from 'rxjs';
import * as moment from "moment";
import Swal from 'sweetalert2';
import { AppConstants } from 'src/app/constants/AppConstants';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { ModalStates } from 'src/app/enums/ModalStates';
import { UserService } from 'src/app/services/user.service';
import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { AssignmentService } from 'src/app/services/assignment.service';
import { ReminderService } from 'src/app/services/reminder.service';
import { GetAssignmentDto } from 'src/app/models/Assignment/GetAssignmentDto';
import { GetAssignmentsForUser } from 'src/app/models/Assignment/GetAssignmentsForUserDto';
import { UpdateAssignmentListDto } from 'src/app/models/AssignmentList/updateAssignmentListDto';
import { CreateAssignmentDto } from 'src/app/models/Assignment/CreateAssignmentDto';
import { CreateReminderDto } from 'src/app/models/Reminder/CreateReminderDto';
import { UserRole } from 'src/app/models/User/UserRole';
import { AssignmentUtilDto } from 'src/app/models/Assignment/AssignmentUtilDto';
import { AssignmentListUserDto } from 'src/app/models/AssignmentList/AssignmentListUserDto';


@Component({
  selector: 'app-administrative-list-details',
  templateUrl: './administrative-list-details.component.html',
  styleUrls: ['./administrative-list-details.component.scss']
})
export class AdministrativeListDetailsComponent extends SelfUnsubscriberBase implements OnInit {
  title = 'Administrative list details'

  userRole : string = localStorage.getItem('role') as unknown as string;
  expectedRole: string = UserRole.AdminRole;

  assignmentListId = this.route.snapshot.paramMap.get("assignmentListId") as unknown as Guid;
  assignmentListName!: string;
  getAssignmentForUser: GetAssignmentsForUser = new GetAssignmentsForUser();

  actualTime!: string;
  defaultDate: string = AppConstants.DEFAULT_DATE;

  modifyAssignmentListDto: UpdateAssignmentListDto = new UpdateAssignmentListDto();
  createAssignmenDto: CreateAssignmentDto = new CreateAssignmentDto();
  createReminderDto: CreateReminderDto = new CreateReminderDto();
  updateReminderDto: CreateReminderDto = new CreateReminderDto();
  updateAssignmentDto: AssignmentUtilDto = new AssignmentUtilDto();

  public modifyListForm!: FormGroup;
  public assignmentForm!:FormGroup;
  public addUserToListForm!: FormGroup;
  public createReminderForm!: FormGroup;
  public updateReminderForm!: FormGroup;

  newAssignmentName?: FormControl;
  newAssignmentDeadline?: FormControl;
  newAssignmentReminder?: FormControl;
  updateAssignmentReminder?: FormControl;
  updateAssignmentDeadline?: FormControl;
  newListName?: FormControl;
  addUserToList?: FormControl;
  newReminder?: FormControl;

  deleteAssignmentId!: Guid;
  deleteAssignmentIndex!: number;

  newMember: boolean = false;
  membersList: string[] = [];

  modalState: string = 'None';
  modalStateEnum = ModalStates;

  tasks: GetAssignmentDto[] = [];
  isTaskExpanded: boolean = false;
  editedTaskIndex: number = 0;

  assignmentListUserDto: AssignmentListUserDto = new AssignmentListUserDto();

  constructor(
    private route: ActivatedRoute,
    private assignmentListService: AssignmentListService,
    private assignmentService: AssignmentService,
    private formBuilder: FormBuilder,
    private navRoute: Router,
    private userService: UserService, 
    private routeToExport: Router,
    private titleService: Title,
    private reminderService: ReminderService
    ) { 
      super();
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

  ngOnInit(): void {
    forkJoin([this.assignmentListService.getAssignmentListName(this.assignmentListId), 
      this.assignmentService.getAssignmentForUser(this.getAssignmentForUser),
      this.userService.getUsersForList(this.assignmentListId)])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([name, assignments, members]) =>{
        this.assignmentListName = name
        this.tasks = assignments
        this.membersList = members
        this.modifyListNameFormInit(this.assignmentListName)
      })

    this.titleService.setTitle(this.title)
  }

  createReminderFormInit(deadline:Date)
  {
    this.createReminderForm = this.formBuilder.group({
      newAssignmentDeadline: [deadline, Validators.required],
      newAssignmentReminder: ['', Validators.required]
    },
    {validator: this.dateLessThan('newAssignmentReminder', 'newAssignmentDeadline')});
  }

  updateReminderFormInit(deadline: Date, reminder: Date)
  {
    this.updateReminderForm = this.formBuilder.group({
      updateAssignmentDeadline: [deadline, Validators.required],
      updateAssignmentReminder: [reminder, Validators.required]
    },
    {validator: this.dateLessThan('updateAssignmentReminder', 'updateAssignmentDeadline')});
  }

  deleteAssignmentInit(deleteAssignmentId: Guid, deleteAssignmentIndex: number)
  {
    this.deleteAssignmentId = deleteAssignmentId;
    this.deleteAssignmentIndex = deleteAssignmentIndex;
  }

  modifyListNameFormInit(newName: string)
  {
    this.modifyListForm = this.formBuilder.group({
      newListName : [newName, Validators.required]
    })
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

  modifyAssignmentFormInit(deadline:Date, reminder:Date, name:string){
    this.assignmentForm = this.formBuilder.group({
      newAssignmentName: [name, Validators.required],
      newAssignmentDeadline: [deadline, Validators.required],
      newAssignmentReminder: [reminder, Validators.required]
    },
    {validator: this.dateLessThan('newAssignmentReminder', 'newAssignmentDeadline')});
  }

  addNewMemberFormInit(){
    this.addUserToListForm = this.formBuilder.group({
      addUserToList: ['', Validators.required, Validators.email]
    })
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

  modifyListName()
  {
    this.modifyAssignmentListDto.name = this.modifyListForm.get('newListName')?.value;
    this.modifyAssignmentListDto.id = this.assignmentListId;

    this.assignmentListService.updateAdministrativeAssignmentList(this.modifyAssignmentListDto)
      .pipe(takeUntil(this.ngUnsubscribe))  
      .subscribe((result: string) => {
        this.assignmentListName = result
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'List name update successfully',
          timer: 1000
        })
      });  
  }

  setModalState(i:number){
    this.modalState = ModalStates[i];
  }

  changeTaskExpanded(index:number)
  {
    this.tasks[index].isDetailsExpanded = !this.tasks[index].isDetailsExpanded;
  }

  changeTaskCompleted(task: GetAssignmentDto){
    const taskId = task.id as unknown as Guid;
    this.assignmentService.changeAssignmentStatus(taskId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => task.status = result)
  } 

  createAssignment(){
    this.createAssignmenDto.name = this.assignmentForm.get('newAssignmentName')?.value;
    this.createAssignmenDto.deadline = this.assignmentForm.get('newAssignmentDeadline')?.value;
    this.createAssignmenDto.status = false;
    this.createAssignmenDto.assignmentListId = this.assignmentListId;
    this.createAssignmenDto.userId = localStorage.getItem("id") as unknown as Guid;
    this.createAssignmenDto.reminderDate = this.assignmentForm.get('newAssignmentReminder')?.value;

    this.assignmentService.createAdministrativeAssignment(this.createAssignmenDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.tasks.push(result)
        Swal.fire({
          icon: 'success',
          title: 'Succes',
          text: "Task added successfully",
          timer: 1000
        })
      })
  }
 
  deleteAssignment(assignmentId: Guid, index: number)
  {
    this.assignmentService
      .deleteAdministrativeAssignments(assignmentId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.tasks.splice(index, 1);
        Swal.fire({
          icon: 'success',
          title: 'Succes',
          text: "Task deleted successfully",
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

  updateReminder(){
    this.updateReminderDto.assignmentId = this.tasks[this.editedTaskIndex].id
    this.updateReminderDto.userId = localStorage.getItem("id") as unknown as Guid;
    this.updateReminderDto.date = this.updateReminderForm.get('updateAssignmentReminder')?.value;

    this.reminderService.updateReminder(this.updateReminderDto)
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
    this.assignmentForm.reset();
  }

  clearNewListName(){
    this.newListName?.reset();
  }

  deleteList(){
    this.assignmentListService
      .deleteAdministrativeAssignmentList(this.assignmentListId)
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
      .navigate([`/administrative-list`])
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

    this.assignmentService.updateAdministrativeAssignment(this.updateAssignmentDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.tasks[this.editedTaskIndex] = result;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Task updated successfully',
          timer: 1000
        })
      })
  }

  goToExportPage(){
    this.routeToExport
    .navigateByUrl(`blank`, {skipLocationChange: true})
    .then(() => this.routeToExport.navigate([`/sort-filter-export/${this.assignmentListId}`]))
  }

  getActualTime()
  {
    this.actualTime = moment(new Date()).format('YYYY-MM-DD hh:mm') ;
  }

  addNewMember(){
    this.assignmentListUserDto.email = this.addUserToListForm.get('addUser')?.value;
    this.assignmentListUserDto.assignmentListId = this.assignmentListId;

    this.assignmentListService.addAssignmentListToUser(this.assignmentListUserDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.membersList.push(result)
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

  clearNewMember(){
    this.addUserToList?.reset();
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
