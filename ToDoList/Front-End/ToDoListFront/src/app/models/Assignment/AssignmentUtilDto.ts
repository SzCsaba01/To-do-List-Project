import { Guid } from "guid-typescript";

export class AssignmentUtilDto{
    public assignmentId?: Guid;
    public name?: string;
    public deadline?: Date;
    public userId?: Guid;
    public reminder?: Date;
}