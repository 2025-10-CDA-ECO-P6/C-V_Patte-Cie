class ErrorException extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message);
        this.status = status;
        this.name = 'ErrorException';

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorException);
        }
    }
}

// Rendre ErrorException disponible globalement
(global as any).ErrorException = ErrorException;

export default ErrorException;
