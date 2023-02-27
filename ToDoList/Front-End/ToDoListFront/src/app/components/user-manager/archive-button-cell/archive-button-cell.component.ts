import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-archive-button-cell',
  templateUrl: './archive-button-cell.component.html',
  styleUrls: ['./archive-button-cell.component.scss']
})
export class ArchiveButtonCellComponent implements ICellRendererAngularComp {

  constructor() { }

  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  btnClickedHandler(event: any){
    this.params.clicked(this.params.node.data['userName'], this.params.node.rowIndex);
  }
}
