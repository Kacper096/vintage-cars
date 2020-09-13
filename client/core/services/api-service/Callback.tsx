import { ErrorDetails } from "../../models/errors/ErrorDetail";

export declare type OnSuccess<T> = (data: T) => void;
export declare type OnError = (error: ErrorDetails) => void;
export declare type OnValidationError = (error: ErrorDetails) => void;

export interface ICallback<T> {
    OnSuccess: OnSuccess<T>,
    OnError: OnError,
    OnValidationError: OnValidationError
}

export interface ICallbackBase {
    OnError: OnError,
    OnValidationError: OnValidationError,
}

export function toCallback<T>(onSuccess: OnSuccess<T> = null, onValidationError: OnValidationError = null, onError: OnError) {
    var callback: ICallback<T> = {
        OnSuccess: onSuccess,
        OnValidationError: onValidationError,
        OnError: onError
    }
    return callback;
}

export function postCallback(onValidationError: OnValidationError = null, onError: OnError = null) {
    const callback: ICallbackBase = {
        OnValidationError: onValidationError,
        OnError: onError,
    } 
    return callback;
}
