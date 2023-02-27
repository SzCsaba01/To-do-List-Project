import { Guid } from "guid-typescript";

export class EditUserDto{
    id!: Guid;
    userName!: string;
    email!: string;
    firstName!: string;
    lastName!: string;
}