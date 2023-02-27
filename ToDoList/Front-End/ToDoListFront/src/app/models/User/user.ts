import { Guid } from "guid-typescript";

export class User{
    public id?: Guid;
    public userName?: string;
    public firstName?: string;
    public lastName?: string;
    public password?: string;
    public isArchived?: boolean;
    public profilePicture?: string;
    public token?: string;
}
