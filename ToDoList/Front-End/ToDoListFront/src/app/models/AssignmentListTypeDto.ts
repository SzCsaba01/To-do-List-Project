import { Guid } from "guid-typescript";
import { ListType } from "../enums/ListType";

export class AssignmentListTypeDto{
    public userId!: Guid;
    public listType!: ListType;
}
