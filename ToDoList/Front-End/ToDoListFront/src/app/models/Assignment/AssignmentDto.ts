import { Guid } from "guid-typescript";
import { AssignmentListDto } from "../AssignmentList/assignmentListDto";

export class AssignmentDto{
    public id?: Guid;
    public name?: string;
    public deadline?: Date;
    public status?: boolean;
    public assignmentList?: AssignmentListDto[];
}