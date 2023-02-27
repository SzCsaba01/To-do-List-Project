import { Guid } from "guid-typescript";

export class CreateAssignmentListDto{
    public userId?: Guid;
    public listType?: number;
    public name?: string;
}