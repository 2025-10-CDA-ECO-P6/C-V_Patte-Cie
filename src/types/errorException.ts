interface ErrorException {
    status: number;
    message: string;
}

interface ErrorExceptionConstructor {
    new (status:number, message?: string): ErrorException;
    (status:number, message?: string): ErrorException;
    readonly prototype: ErrorException;
}

declare var ErrorException: ErrorExceptionConstructor;
