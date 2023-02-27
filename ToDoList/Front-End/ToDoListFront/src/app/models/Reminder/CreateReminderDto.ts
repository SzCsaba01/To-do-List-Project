import { Guid } from "guid-typescript";

export class CreateReminderDto{
    public date?: Date;
    public userId?: Guid;
    public assignmentId?: Guid;
}