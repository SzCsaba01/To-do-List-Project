import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { forkJoin, takeUntil } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { XlsGeneratorService } from 'src/app/services/xls-generator.service';
import { formatDate } from '@angular/common';
import { dateFormat } from '../../formats/dateFormat';

import { AssignmentListService } from 'src/app/services/assignment-list.service';
import { AssignmentService } from 'src/app/services/assignment.service';
import { GetAssignmentDto } from 'src/app/models/Assignment/GetAssignmentDto';
import { GetAssignmentsForUser } from 'src/app/models/Assignment/GetAssignmentsForUser';

const gridOptions = {
  defaultColDef: {
    editable: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  },
  suppressRowClickSelection: true,
  groupSelectsChildren: true,
  // debug: true,
  rowSelection: 'multiple',
  rowGroupPanelShow: 'always',
  pivotPanelShow: 'always',
  pagination: true,
};

@Component({
  selector: 'app-sort-filter-export',
  templateUrl: './sort-filter-export.component.html',
  styleUrls: ['./sort-filter-export.component.scss']
})

export class SortFilterExportComponent {
  assignmentListId = this.route.snapshot.paramMap.get("assignmentListId") as unknown as Guid
  assignmentListName!: string
  getAssignmentForUser: GetAssignmentsForUser = new GetAssignmentsForUser()
  tasks: GetAssignmentDto[] = []

  public rowData: any[] = [];

  constructor(
    public xlsGeneratorService: XlsGeneratorService,
    @Inject(LOCALE_ID) public locale: string,
    private route: ActivatedRoute,
    private assignmentListService: AssignmentListService,
    private assignmentService: AssignmentService,
  ) {
    this.getAssignmentForUser.UserId = localStorage.getItem("id") as unknown as Guid;
    this.getAssignmentForUser.AssignmentListId = this.assignmentListId;
  }

  

  private gridApi!: GridApi;
  public columns: any[] = ['Name', 'Deadline', 'Status'];
  public excelData: any[] = [];

  //this is only some hardcode but the data will be provided by an http request
  

  ngOnInit(){
    forkJoin([this.assignmentListService.getAssignmentListName(this.assignmentListId),
      this.assignmentService.getAssignmentForExcel(this.getAssignmentForUser)])
      //.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([name, assignemnts]) => {
        this.assignmentListName = name,
        this.tasks = assignemnts,
        this.dataConverter(this.tasks)
      })   
      }

  dataConverter(tasksGet:any) {
    this.rowData = tasksGet;
    this.rowData.forEach((value) => {
      value.deadline = formatDate(value.deadline!, dateFormat, this.locale);
      value.status = value.status ? "completed" : "uncompleted";
      
    });
  }

  

  public defaultColDef: ColDef = {
    editable: true,
    resizable: true,
    sortable: true,
    filter: true,
  };

  public columnDefs: ColDef[] = [
    { headerName: 'Assignment name', field: 'name', width: 180 },
    {
      headerName: 'Deadline',
      field: 'deadline',
      width: 200,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: function (filterLocalDateAtMidnight: Date, cellValue: any) {
          var dateAsString = cellValue;
          if (dateAsString == null) return -1;
          var dateParts = dateAsString.split("-");
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
            return 0;
          }
          else if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          else return 1;
        },
        browserDatePicker: false
      }
    },
    {
      headerName: 'Status', field: 'status', width: 130
    }
  ];

  
  getSelectedRowData() {
    this.gridApi.forEachNodeAfterFilterAndSort((node) => {
      this.excelData.push(node.data);
    });
    this.exportExcel();
    this.excelData = [];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  exportExcel() {
    this.xlsGeneratorService.exportAsExcelFile('Name of the list', this.columns, this.excelData, 'Assignments');
  }
}
