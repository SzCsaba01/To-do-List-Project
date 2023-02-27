import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Guid } from 'guid-typescript';
import Swal from 'sweetalert2';
import { forkJoin, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ModalStates } from 'src/app/enums/ModalStates';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { AssignmentService } from 'src/app/services/assignment.service';
import { GetAssignmentDto } from 'src/app/models/Assignment/GetAssignmentDto';
import { GetAssignmentsForUser } from 'src/app/models/Assignment/GetAssignmentsForUser';
import { UpdateAssignmentListDto } from 'src/app/models/AssignmentList/updateAssignmentListDto';
import { CreateAssignmentDto } from 'src/app/models/Assignment/CreateAssignmentDto';
import { CreateReminderDto } from 'src/app/models/Reminder/CreateReminderDto';
import { AssignmentUtilDto } from 'src/app/models/Assignment/AssignmentUtilDto';
import { UpdateSubAssignmentDto } from 'src/app/models/SubAssignment/UpdateSubAsignmentDto';
import { AddSubAssignmentDto } from 'src/app/models/SubAssignment/AddSubAssignmentDto';
import { SubAssignmentDto } from 'src/app/models/SubAssignment/SubAssignmentDto';
import { SubAssignmentService } from 'src/app/services/sub-assignment.service';
import { ChangeAllSubAssignmentStatusDto } from 'src/app/models/SubAssignment/ChangeAllSubAssignmentStatus';

@Component({
  selector: 'app-private-list-details',
  templateUrl: './private-list-details.component.html',
  styleUrls: ['./private-list-details.component.scss']
})
export class PrivateListDetailsComponent extends SelfUnsubscriberBase implements OnInit {
  assignmentListId = this.route.snapshot.paramMap.get("assignmentListId") as unknown as Guid;
  assignmentListName!: string;
  getAssignmentForUser: GetAssignmentsForUser = new GetAssignmentsForUser();

  modalState: string = 'None';
  modalStateEnum = ModalStates;

  editedTaskIndex!: number;
	displayAddSubAssignmentForm: boolean = false;

	addNewSubAssignmentForm!: FormGroup;

	newSubAssignment?: FormControl;
  tasks: GetAssignmentDto[] = [];
  assignmentId:any;

  isShownTaskDetails: boolean[] = [];

  listName: string = "";
  assignmentName: string = "";
  assignmentDeadline: Date = new Date();
  assignmentReminder: Date = new Date();

  public modifyListForm!:FormGroup;
  public assignmentForm!:FormGroup;

  newAssignmentName?: FormControl;
  newAssignmentDeadline?: FormControl;
  newAssignmentReminder?: FormControl;
  newListName?: FormControl;

  actualTime!: string;

  createAssignmenDto: CreateAssignmentDto = new CreateAssignmentDto();
  createReminderDto: CreateReminderDto = new CreateReminderDto();
  modifyAssignmentListDto: UpdateAssignmentListDto = new UpdateAssignmentListDto();
  updateAssignmentDto: AssignmentUtilDto = new AssignmentUtilDto();

  deleteAssignmentId!: Guid;
  deleteAssignmentIndex!: number;

  title: string = 'Private list details';

  constructor(
    private formBuilder: FormBuilder,
    private navRoute: Router,
    private route: ActivatedRoute,
    private assignmentListService: AssignmentListService,
    private assignmentService: AssignmentService,
    private routeToExport: Router,
    private titleService: Title,
    private subAssignmentService: SubAssignmentService,
  ) { 
    super();   
    this.getAssignmentForUser.UserId = localStorage.getItem("id") as unknown as Guid;
    this.getAssignmentForUser.AssignmentListId = this.assignmentListId;

    this.newSubAssignment = new FormControl('', Validators.required);

    this.addNewSubAssignmentForm = this.formBuilder.group({
      'name': this.newSubAssignment,
    });

    this.assignmentForm = this.formBuilder.group({
      'newAssignmentName': ['', Validators.required],
      'newAssignmentDeadline': ['', Validators.required],
      'newAssignmentReminder': ['', Validators.required]
    },
    {validator: this.dateLessThan('newAssignmentReminder', 'newAssignmentDeadline')})
  }

  ngOnInit() {
    forkJoin([this.assignmentListService.getAssignmentListName(this.assignmentListId),
      this.assignmentService.getAssignmentForUser(this.getAssignmentForUser)])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([name, assignemnts]) => {
        this.assignmentListName = name;
        this.tasks = assignemnts;

        this.tasks.forEach(task => {
          task.numberOfCompletedTasks = 0;

          task.subAssignmentDto.forEach(subAssignment => {
            if(subAssignment.status){
              task.numberOfCompletedTasks++;
            }
          });
        });

        this.modifyListNameFormInit(this.assignmentListName);
      })

    this.titleService.setTitle(this.title)
  }

  modifyListNameFormInit(newName: string)
  {
    this.modifyListForm = this.formBuilder.group({
      newListName : [newName, Validators.required]
    })
  }

  modifyAssignmentFormInit(deadline: Date, reminder: Date, name: string){
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

  changeTaskExpanded(index:number){
    this.tasks[index].isDetailsExpanded = !this.tasks[index].isDetailsExpanded;
  }

  setEditedTaskIndex(index: number)
  {
    this.editedTaskIndex = index;
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
          title: 'Sucess',
          timer: 1000,
          text: 'List name updated successfully'
        });
      });
  }

  convertToSharedList(){
    this.assignmentListService.convertPrivateToSharedAssignmentList(this.assignmentListId)
    .pipe(takeUntil(this.ngUnsubscribe))  
    .subscribe(() =>
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Successfully converted your private list to a shared list',
        timer: 1000
      })
    );

    this.navRoute.navigate([`/private-list`]);
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
      .navigate([`/private-list`])
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

  updateAssignment(){
    this.updateAssignmentDto.name = this.assignmentForm.get('newAssignmentName')?.value;
    this.updateAssignmentDto.assignmentId = this.tasks[this.editedTaskIndex].id
    this.updateAssignmentDto.deadline = this.assignmentForm.get('newAssignmentDeadline')?.value;
    this.updateAssignmentDto.userId = localStorage.getItem("id") as unknown as Guid;
    this.updateAssignmentDto.reminder = this.assignmentForm.get('newAssignmentReminder')?.value;

    this.assignmentService.updateAssignment(this.updateAssignmentDto)
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
  
  clearNewAssignmentForm()
  {
    this.assignmentForm.reset()
  }

  changeTaskCompleted(task: GetAssignmentDto, taskIndex: number){
    const taskId = task.id as unknown as Guid;

    this.assignmentService.changeAssignmentStatus(taskId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        task.status = result

        var changeAllSubAssignmentStatus = new ChangeAllSubAssignmentStatusDto();
        changeAllSubAssignmentStatus.assignmentId = taskId;
        changeAllSubAssignmentStatus.status = result;
        this.subAssignmentService.changeAllSubAssignmentStatus(changeAllSubAssignmentStatus)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.tasks[taskIndex].subAssignmentDto.forEach(subAssignment => {
              subAssignment.status = result;
            });

            if(result){
              this.tasks[taskIndex].numberOfCompletedTasks = this.tasks[taskIndex].subAssignmentDto.length;
            }
            else{
              this.tasks[taskIndex].numberOfCompletedTasks = 0;
            }
          });
      })
  }

  onCheckboxChange(subAssignmentId: Guid, assignmentIndex: number, subAssignmentIndex: number ){
    this.subAssignmentService.switchSubAssignmentStatus(subAssignmentId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if(this.tasks[assignmentIndex].subAssignmentDto[subAssignmentIndex].status){
          this.tasks[assignmentIndex].numberOfCompletedTasks++;
        }
        else{
          this.tasks[assignmentIndex].numberOfCompletedTasks--;
        }
        this.checkSubAssignments(assignmentIndex);
      });
  }

  checkSubAssignments(index : number){
    if(this.tasks[index].numberOfCompletedTasks == this.tasks[index].subAssignmentDto.length && !this.tasks[index].status){
      this.assignmentService.changeAssignmentStatus(this.tasks[index].id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          result => this.tasks[index].status = result
        );
    }

    if(this.tasks[index].numberOfCompletedTasks != this.tasks[index].subAssignmentDto.length && this.tasks[index].status){
      this.assignmentService.changeAssignmentStatus(this.tasks[index].id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        result => this.tasks[index].status = result
      );
    }
  }

  changeShowAddSubAssignmentForm(){
    this.displayAddSubAssignmentForm = !this.displayAddSubAssignmentForm;
  }

  addSubAssignment(addSubAssignmentDto: AddSubAssignmentDto, id: Guid, index: number){
    if(addSubAssignmentDto.name){
      addSubAssignmentDto.assignmentId = id;
      this.subAssignmentService.addSubAssignment(addSubAssignmentDto)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result) => {
          this.tasks[index].subAssignmentDto.push(result);
          this.addNewSubAssignmentForm.reset();

          if(this.tasks[index].status){
            this.assignmentService.changeAssignmentStatus(id)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(
                result => this.tasks[index].status = result
              );
          }
        });
    }
  }

  deleteSubAssignment(assignmentIndex: number, subAssignmentIndex: number, subAssingmentId: Guid){

    this.subAssignmentService.deleteSubAssignment(subAssingmentId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if(this.tasks[assignmentIndex].subAssignmentDto[subAssignmentIndex].status){
          this.tasks[assignmentIndex].numberOfCompletedTasks--;
        }

        this.tasks[assignmentIndex].subAssignmentDto.splice(subAssignmentIndex, 1);

        if(this.tasks[assignmentIndex].numberOfCompletedTasks == this.tasks[assignmentIndex].subAssignmentDto.length && !this.tasks[assignmentIndex].status){
          this.checkSubAssignments(assignmentIndex);
        }
      })
  }

  changeSubAssignmentEditableStatus(assignmentIndex: number, subAssignmentIndex: number){
    this.tasks[assignmentIndex].subAssignmentDto[subAssignmentIndex].editable = !this.tasks[assignmentIndex].subAssignmentDto[subAssignmentIndex].editable;
  }
  
  updateSubAssignment(event: any, assignmentIndex: number, subAssignmentIndex: number){
    var updateSubAssignment = new UpdateSubAssignmentDto();

    updateSubAssignment.subAssignmentId = this.tasks[assignmentIndex].subAssignmentDto[subAssignmentIndex].id;
    updateSubAssignment.name = event.target.value;

    this.subAssignmentService.updateSubAssignment(updateSubAssignment)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.tasks[assignmentIndex].subAssignmentDto[subAssignmentIndex].name = updateSubAssignment.name;
        this.changeSubAssignmentEditableStatus(assignmentIndex, subAssignmentIndex);
      })
  }

  orderAssignmentsByStatusAndDeadline(){
    this.assignmentService.orderAssignmentsByStatusAndDeadline(this.getAssignmentForUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.tasks = result)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }
}
