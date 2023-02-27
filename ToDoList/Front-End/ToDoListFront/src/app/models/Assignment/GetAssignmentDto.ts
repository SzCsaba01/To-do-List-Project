import { Guid } from "guid-typescript";
import { SubAssignmentDto } from "../SubAssignment/SubAssignmentDto";

export class GetAssignmentDto{
    public id!: Guid;
    public name!: string;
    public deadline!: Date;
    public status!: boolean;
    public reminder?: Date;
    public subAssignmentDto: SubAssignmentDto[] = [];

    public numberOfCompletedTasks!: number;
    public isDetailsExpanded?: boolean = false;
}