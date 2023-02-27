import { Guid } from "guid-typescript";

export class UploadUserProfilePictureDto{
    userId!: Guid;
    file?: FormData;
    path?: string;
}