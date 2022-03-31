import { TokenMetadata } from "@taquito/tzip12";

export interface INotification{
    type: ErrorType,
    message: string
}

export interface IExtendedMetaDataToken extends TokenMetadata{
    description?: string
    displayUri?:string
}

export type ErrorType = "error" | "informtion" | "success"