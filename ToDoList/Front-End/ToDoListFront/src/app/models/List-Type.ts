import { Guid } from "guid-typescript";
import { AssignmentList } from "./AssignmentList/assignment-list";

export enum ListType{
    Administrative = 'Administrative',
    Shared = 'Shared',
    Normal = 'Normal',
}

export class AssignmentListType{
    public id?: Guid;
    public listType?: ListType;
    public assignmentList?: AssignmentList[];
}
