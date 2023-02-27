import { Guid } from "guid-typescript";

export class CreateAssignmentDto{
    public name?: string;
    public deadline?: Date;
    public status?: boolean;
    public assignmentListId!: Guid;
    public userId!: Guid;
    public reminderDate!: Date;
}