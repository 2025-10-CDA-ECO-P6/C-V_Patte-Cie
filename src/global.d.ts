declare class ErrorException extends Error {
    status: number;
    constructor(status: number, message?: string);
}
