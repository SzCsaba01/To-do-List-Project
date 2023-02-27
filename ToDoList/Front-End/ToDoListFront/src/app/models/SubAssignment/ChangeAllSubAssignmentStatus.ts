import { Guid } from "guid-typescript";

export class ChangeAllSubAssignmentStatusDto{
    assignmentId!: Guid;
    status!: boolean;
}