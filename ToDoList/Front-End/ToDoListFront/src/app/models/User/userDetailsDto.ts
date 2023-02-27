import { Guid } from "guid-typescript"

export class UserDetailsDto{
    id!: Guid;
    userName!: string;
    lastName!: string;
    firstName!: string;
    email!: string;
    profilePicture!: string; 
}