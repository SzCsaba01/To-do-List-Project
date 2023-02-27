import { Guid } from "guid-typescript";
import { AssignmentDto } from "../Assignment/AssignmentDto"; 
import { AssignmentListTypeDto } from "../AssignmentListTypeDto";
import { User } from "../User/user";

export class AssignmentList{
    public id?: Guid;
    public name?: string;
    public status?: boolean;
    public users?: User[];
    public listType?: AssignmentListTypeDto;
    public assignment?: AssignmentDto[];
}