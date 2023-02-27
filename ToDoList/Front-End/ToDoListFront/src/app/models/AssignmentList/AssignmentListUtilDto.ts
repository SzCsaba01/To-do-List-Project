import { Guid } from "guid-typescript";

export class AssignmentListUtilDto{
    public id?: Guid;
    public name?: string;
    public status?: boolean;
    public listTypeId?: Guid;
}