import { Guid } from "guid-typescript";

export class ResetPasswordDto{
    public id!: Guid;
    public newPassword!: string;
    public repeatNewPassword!: string;
}
