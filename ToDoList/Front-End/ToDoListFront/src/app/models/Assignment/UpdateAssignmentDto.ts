import { Guid } from "guid-typescript";

export class UpdateAssignmentDto{
    public id!: Guid;
    public name?: string;
    public deadline?: Date;
    public status?: boolean;
}