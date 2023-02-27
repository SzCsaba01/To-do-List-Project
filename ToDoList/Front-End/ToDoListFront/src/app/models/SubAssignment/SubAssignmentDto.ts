import { Guid } from "guid-typescript";

export class SubAssignmentDto{
    public id!: Guid;
    public name!: string;
    public status!: boolean;
    
    public editable!: boolean;
}