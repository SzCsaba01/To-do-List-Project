import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { passwordFormat } from 'src/app/formats/dateFormat';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { UserService } from 'src/app/services/user.service';
import { AddUserDto } from 'src/app/models/User/addUserDto';
import { GetUserDto } from 'src/app/models/User/GetUserDto';
import { ColDef, GridApi, GridOptions, GridReadyEvent,  IGetRowsParams } from 'ag-grid-community';
import { AppConstants } from 'src/app/constants/AppConstants';
import { DeleteButtonCellComponent } from './delete-button-cell/delete-button-cell.component';
import { ArchiveButtonCellComponent } from './archive-button-cell/archive-button-cell.component';
import { UserSearchDto } from 'src/app/models/User/UserSearchDto';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent extends SelfUnsubscriberBase implements OnInit {

  gridApi!: GridApi;

  gridOptions!: GridOptions;

  params!: IGetRowsParams;

  rowData!: any;

  currentPage: number = 1;
  totalNumberOfPages!: number;
  totalNumberOfUsers!: number;
  currentNumberOfUsersStartRow: number = 1;
  currentNumberOfUsersEndRow!: number;

  searchedUserName: string = "";
  searchedEmail: string = "";

  title: string = 'User Manager'

  private deleteUsername!: string;

  columnDefs: ColDef[] = [
    { 
      headerName: "Username", 
      field: "userName", 
      sortable: true,
    },
    { 
      headerName: "Email", 
      field: "email", 
      sortable: true,
    },
    {
      headerName: "First Name",
      field: "firstName",
      sortable: true, 
    },
    {
      headerName: "Last Name",
      field: "lastName",
      sortable: true,
    },
    { 
      headerName: "IsArchived", 
      field: "isArchived", 
      sortable: false,
    },
    {
      headerName: "Delete",
      field: "delete",
      sortable: false,
      cellRenderer: DeleteButtonCellComponent,
      cellRendererParams: {
        clicked: (userName:string ) => {
          this.deleteUsername = userName;
          this.changeShowDeleteUser();
        }
      }
    },
    {
      headerName: "Archive",
      field: "archive",
      sortable: false,
      cellRenderer: ArchiveButtonCellComponent,
      cellRendererParams: {
        clicked: (userName: string, index: number) => {
          this.archiveUser(userName, index);
        }
      }
    }
  ]
  
  public defaultColDef: ColDef = {
    editable: false,
    resizable: false, 
  };

  isShownAddNewUser: boolean = false;
  isShownDeleteUser: boolean = false;

  addUserForm!: FormGroup;

  userName?: FormControl;
  email?: FormControl;
  firstName?: FormControl;
  lastName?: FormControl;
  password?: FormControl;

  constructor(
    private userService : UserService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) {
      super();

      this.userName = new FormControl('',[Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-Z0-9]*'), Validators.maxLength(20)]);
      this.email = new FormControl('', [Validators.required, Validators.email]);
      this.firstName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]);
      this.lastName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]);
      this.password = new FormControl('',[Validators.required, Validators.pattern(passwordFormat), Validators.minLength(8)])

      this.addUserForm = this.formBuilder.group({
        'userName': this.userName,
        'email': this.email,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'password': this.password
      });

      this.gridOptions = <GridOptions>{
        rowModelType: "clientSide",
        pagination: true,
        paginationPageSize: AppConstants.USERS_PER_PAGE,
        suppressPaginationPanel: true,
        suppressScrollOnNewData: true,
        cacheBlockSize: 10
      };
    }

  ngOnInit(): void {
    this.titleService.setTitle(this.title)
  }

  deleteUser(){
    this.userService.deleteUser(this.deleteUsername)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeShowDeleteUser();
        if(this.searchedUserName){
          this.getSearchedUsersByUserName(0);
        }

        if(this.searchedEmail){
          this.getSearchedUsersByEmail(0);
        }

        if(!this.searchedEmail && !this.searchedUserName){
          this.getPaginatedUsers(0);
        }
        this.addUserForm.reset();
      });
  }

  archiveUser(userName: string, index: number){
    this.userService.changeArchiveStatus(userName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
       this.gridApi.getDisplayedRowAtIndex(index)!
        .setDataValue('isArchived', !this.gridApi.getDisplayedRowAtIndex(index)!.data['isArchived']);
      });
  }

  changeShowAddNewUserStatus(){
    this.isShownAddNewUser = !this.isShownAddNewUser;
  }

  changeShowDeleteUser(){
    this.isShownDeleteUser = !this.isShownDeleteUser;
  }

  onAddUser(addUserDto: AddUserDto){
    var addUserToList = new GetUserDto();
    addUserToList.email = addUserDto.email;
    addUserToList.userName = addUserDto.userName;
    addUserToList.isArchived = false;

    this.userService.createUser(addUserDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if(this.searchedUserName){
          this.getSearchedUsersByUserName(0);
        }

        if(this.searchedEmail){
          this.getSearchedUsersByEmail(0);
        }

        if(!this.searchedEmail && !this.searchedUserName){
          this.getPaginatedUsers(0);
        }
        this.addUserForm.reset();
        this.changeShowAddNewUserStatus();
      })
  }

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.userService.getUsersPaginated(this.currentPage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.rowData = result.getUserDto;
        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;
        this.currentNumberOfUsersEndRow = this.rowData.length;
      })
  }

  nextPage(){
    this.currentPage++;
    
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(1);
    }

    if(this.searchedUserName){
     this.getSearchedUsersByUserName(1)
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(1);
    }

  }

  lastPage(){
    this.currentPage = this.totalNumberOfPages;

    if(this.searchedEmail){
      this.getSearchedUsersByEmail(2);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(2);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(2);
    }
  }

  previousPage(){
    this.currentPage--;
  
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(-1);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-1);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(-1);
    }
  }

  firstPage(){
    this.currentPage = 1;
    
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(-2);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-2);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(-2);
    }
  }

  onSearchByUserName(){
    this.currentPage = 1;

    if(this.searchedEmail){
      this.searchedEmail = "";
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-2);
    }
    else{
      this.getPaginatedUsers(-2);
    }
  }

  onSearchByEmail(){
    this.currentPage = 1;

    if(this.searchedUserName){
      this.searchedUserName = "";
    }

    if(this.searchedEmail){
     this.getSearchedUsersByEmail(-2);
    }
    else{
      this.getPaginatedUsers(-2);
    }
  }

  getPaginatedUsers(direction: number){
    this.userService.getUsersPaginated(this.currentPage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getUserDto;
      })
  }

  getSearchedUsersByUserName(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.page = this.currentPage;
    searchedUsers.search = this.searchedUserName;

    this.userService.getSearchedUsersByUserName(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getUserDto;
      })
  }

  getSearchedUsersByEmail(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.page = this.currentPage;
    searchedUsers.search = this.searchedEmail;

    this.userService.getSearchedUsersByEmail(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getUserDto;
      })
  }
}
